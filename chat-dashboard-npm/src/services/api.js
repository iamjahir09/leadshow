import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const getConversations = () =>
  api.get("/conversations").then((r) => r.data);

export const getMessages = (conversationId) =>
  api.get(`/messages/${conversationId}`).then((r) => r.data);

export const sendMessage = (conversationId, content) =>
  api.post("/sendMessage", { conversationId, content }).then((r) => r.data);

export const toggleStatus = (conversationId, status) =>
  api.post("/toggleStatus", { conversationId, status }).then((r) => r.data);
