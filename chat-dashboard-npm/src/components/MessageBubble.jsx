function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }) {
  const isOutgoing = message.message_type === 1;

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isOutgoing
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-slate-800 text-slate-100 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isOutgoing ? "text-blue-200" : "text-slate-400"
          } text-right`}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}
