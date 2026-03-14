import { useState } from "react";
import ConversationList from "./ConversationList.jsx";

export default function Sidebar({ conversations, activeId, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    (c.meta?.sender?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-lg font-bold text-slate-100 mb-3">Inbox</h1>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-blue-600 transition-colors"
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <ConversationList
          conversations={filtered}
          activeId={activeId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
