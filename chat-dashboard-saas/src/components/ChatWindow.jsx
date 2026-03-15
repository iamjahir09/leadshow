import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import { getMessages, sendMessage } from "../services/api.js";

export default function ChatWindow({ conversation, onMenuClick }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(conversation?.status);
  const bottomRef = useRef(null);

  useEffect(() => {
    setStatus(conversation?.status);
  }, [conversation?.status]);

  useEffect(() => {
    if (!conversation) return;
    setLoading(true);
    getMessages(conversation.id)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(content) {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage(conversation.id, content);
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  if (!conversation) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>Select a conversation to start</p>
        </div>
      </div>
    );
  }

  const sender = conversation.meta?.sender;
  const isOpen = status === "open";

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div>
            <div className="chat-header-name">{sender?.name}</div>
          </div>
          <span className={`status-badge ${isOpen ? "open" : "resolved"}`}>
            {isOpen ? "Open" : "Resolved"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {loading ? (
          <div className="messages-loading">
            <div className="spinner" />
          </div>
        ) : messages.length === 0 ? (
          <div className="messages-empty">
            <p>No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
