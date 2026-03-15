import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";

const router = Router();

// SIGNUP
router.post("/auth/signup", async (req, res) => {
  const { email, password, chatwoot_url, account_id, access_token } = req.body;

  if (!email || !password || !chatwoot_url || !account_id || !access_token) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  // Verify Chatwoot credentials before saving
  try {
    const url = `${chatwoot_url}/api/v1/accounts/${account_id}/conversations`;
    const resp = await fetch(url, { headers: { api_access_token: access_token } });
    if (resp.status === 401) {
      return res.status(400).json({ error: "Invalid Chatwoot credentials. Please check your URL, Account ID and Access Token." });
    }
  } catch {
    return res.status(400).json({ error: "Could not connect to Chatwoot. Please check your URL." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = db.prepare(
    "INSERT INTO users (email, password, chatwoot_url, account_id, access_token) VALUES (?, ?, ?, ?, ?)"
  ).run(email, hashed, chatwoot_url, account_id, access_token);

  const token = jwt.sign({ userId: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, email });
});

// LOGIN
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, email: user.email });
});

// GET CURRENT USER
router.get("/auth/me", (req, res) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Not authenticated" });
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare("SELECT id, email, created_at FROM users WHERE id = ?").get(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
