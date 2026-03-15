import { Router } from "express";
import { authMiddleware } from "./middleware.js";
import db from "./db.js";

const router = Router();

function getUser(userId) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) throw new Error("User not found");
  return user;
}

async function chatwootFetch(user, path, options = {}) {
  const url = `${user.chatwoot_url}/api/v1/accounts/${user.account_id}${path}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      api_access_token: user.access_token,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return resp.json();
}

// GET conversations
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const user = getUser(req.userId);
    const data = await chatwootFetch(user, "/conversations");
    const payload = data?.data?.payload ?? data ?? [];
    res.json(Array.isArray(payload) ? payload : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET messages
router.get("/messages/:conversationId", authMiddleware, async (req, res) => {
  try {
    const user = getUser(req.userId);
    const data = await chatwootFetch(user, `/conversations/${req.params.conversationId}/messages`);
    const payload = data?.payload ?? data ?? [];
    res.json(Array.isArray(payload) ? payload : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST send message
router.post("/sendMessage", authMiddleware, async (req, res) => {
  const { conversationId, content } = req.body;
  if (!conversationId || !content) {
    return res.status(400).json({ error: "conversationId and content required" });
  }
  try {
    const user = getUser(req.userId);
    const data = await chatwootFetch(
      user,
      `/conversations/${conversationId}/messages`,
      { method: "POST", body: JSON.stringify({ content, message_type: "outgoing", private: false }) }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST toggle status
router.post("/toggleStatus", authMiddleware, async (req, res) => {
  const { conversationId, status } = req.body;
  if (!conversationId || !status) {
    return res.status(400).json({ error: "conversationId and status required" });
  }
  try {
    const user = getUser(req.userId);
    const data = await chatwootFetch(
      user,
      `/conversations/${conversationId}/update`,
      { method: "PATCH", body: JSON.stringify({ status }) }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
