import { useState } from "react";
import { toggleStatus } from "../services/api.js";

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function ContactPanel({ conversation, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const sender = conversation?.meta?.sender;
  const isOpen = conversation?.status === "open";

  async function handleToggle() {
    if (!conversation || loading) return;
    const newStatus = isOpen ? "resolved" : "open";
    setLoading(true);
    try {
      await toggleStatus(conversation.id, newStatus);
      onStatusChange(conversation.id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!conversation) return null;

  return (
    <div className="contact-panel">
      <div className="contact-hero">
        <div className="contact-avatar">{getInitials(sender?.name)}</div>
        <div className="contact-name">{sender?.name}</div>
        <span className={`status-badge ${isOpen ? "open" : "resolved"}`}>
          {isOpen ? "Active" : "Resolved"}
        </span>
      </div>

      <div className="contact-body">
        <div className="contact-field">
          <label>Phone</label>
          <p>{sender?.phone_number || "—"}</p>
        </div>
       
        
        {conversation.last_activity_at && (
          <>
            <div className="contact-divider" />
            <div className="contact-field">
              <label>Last Active</label>
              <p>{new Date(conversation.last_activity_at * 1000).toLocaleDateString()}</p>
            </div>
          </>
        )}
      </div>

      <div className="contact-footer">
        <button
          className={`btn-resolve ${isOpen ? "resolve" : "reopen"}`}
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? "Updating..." : isOpen ? "✓ Resolve" : "↩ Reopen"}
        </button>
      </div>
    </div>
  );
}
