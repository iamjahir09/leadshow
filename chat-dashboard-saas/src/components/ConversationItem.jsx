function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function ConversationItem({ conversation, isActive, onClick }) {
  const sender = conversation.meta?.sender;
  const lastMsg = conversation.messages?.[conversation.messages.length - 1];
  const unread = conversation.unread_count || 0;

  return (
    <button className={`conv-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="conv-avatar">
        {getInitials(sender?.name)}
        <span className={`conv-avatar-dot ${conversation.status}`} />
      </div>
      <div className="conv-info">
        <div className="conv-top">
          <span className="conv-name">{sender?.name || "Unknown"}</span>
          <span className="conv-time">{formatTime(conversation.last_activity_at)}</span>
        </div>
        <div className="conv-bottom">
          <span className="conv-preview">{lastMsg?.content || "No messages"}</span>
          {unread > 0 && <span className="conv-badge">{unread}</span>}
        </div>
      </div>
    </button>
  );
}
