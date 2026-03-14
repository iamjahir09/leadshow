import { toggleStatus } from "../services/api.js";
import { useState } from "react";

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
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
    <div className="w-64 flex-shrink-0 bg-slate-900 border-l border-slate-700 flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="p-6 flex flex-col items-center text-center border-b border-slate-700">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white mb-3">
          {getInitials(sender?.name)}
        </div>
        <h2 className="text-base font-bold text-slate-100">{sender?.name}</h2>
        <span
          className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isOpen
              ? "bg-green-600/20 text-green-400"
              : "bg-slate-700 text-slate-400"
          }`}
        >
          {conversation.status?.toUpperCase()}
        </span>
      </div>

      <div className="p-5 space-y-4 flex-1">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Email
          </p>
          <p className="text-sm text-slate-300 break-all">
            {sender?.email || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Phone
          </p>
          <p className="text-sm text-slate-300">{sender?.phone_number || "—"}</p>
        </div>
      </div>

      <div className="p-5 border-t border-slate-700">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 ${
            isOpen
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-slate-100"
          }`}
        >
          {loading ? "Updating..." : isOpen ? "Resolve" : "Reopen"}
        </button>
      </div>
    </div>
  );
}
