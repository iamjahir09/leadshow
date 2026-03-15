function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message }) {
  const isOutgoing = message.message_type === 1;

  return (
    <div className={`msg-row ${isOutgoing ? "outgoing" : "incoming"}`}>
      <div className="msg-bubble">
        <div className="msg-content">{message.content}</div>
        <span className="msg-time">{formatTime(message.created_at)}</span>
      </div>
    </div>
  );
}
