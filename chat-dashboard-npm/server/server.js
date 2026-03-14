import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getConversations,
  getMessages,
  sendMessage,
  toggleConversationStatus,
} from "./chatwootService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/conversations", async (req, res) => {
  try {
    const data = await getConversations();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/messages/:conversationId", async (req, res) => {
  try {
    const data = await getMessages(Number(req.params.conversationId));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sendMessage", async (req, res) => {
  const { conversationId, content } = req.body;
  if (!conversationId || !content) {
    return res.status(400).json({ error: "conversationId and content required" });
  }
  try {
    const data = await sendMessage(conversationId, content);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/toggleStatus", async (req, res) => {
  const { conversationId, status } = req.body;
  if (!conversationId || !status) {
    return res.status(400).json({ error: "conversationId and status required" });
  }
  try {
    const data = await toggleConversationStatus(conversationId, status);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
