import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const signup = (data) =>
  api.post("/auth/signup", data).then((r) => r.data);

export const login = (data) =>
  api.post("/auth/login", data).then((r) => r.data);

export const getMe = () =>
  api.get("/auth/me").then((r) => r.data);

export const getConversations = () =>
  api.get("/conversations").then((r) => r.data);

export const getMessages = (conversationId) =>
  api.get(`/messages/${conversationId}`).then((r) => r.data);

export const sendMessage = (conversationId, content) =>
  api.post("/sendMessage", { conversationId, content }).then((r) => r.data);

export const toggleStatus = (conversationId, status) =>
  api.post("/toggleStatus", { conversationId, status }).then((r) => r.data);
