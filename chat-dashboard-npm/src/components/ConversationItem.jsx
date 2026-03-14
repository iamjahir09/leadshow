function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ConversationItem({ conversation, isActive, onClick }) {
  const sender = conversation.meta?.sender;
  const lastMsg = conversation.messages?.[conversation.messages.length - 1];
  const unread = conversation.unread_count || 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
        isActive
          ? "bg-blue-600/20 border border-blue-600/40"
          : "hover:bg-slate-800 border border-transparent"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
        {getInitials(sender?.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-100 truncate">
            {sender?.name || "Unknown"}
          </span>
          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-1">
            {formatTime(conversation.last_activity_at)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-slate-400 truncate">
            {lastMsg?.content || "No messages"}
          </span>
          {unread > 0 && (
            <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
