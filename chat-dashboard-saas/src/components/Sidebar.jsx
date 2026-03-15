import { useState } from "react";
import ConversationList from "./ConversationList.jsx";

export default function Sidebar({ conversations, activeId, onSelect, isOpen }) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    (c.meta?.sender?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">Inbox</div>
        <div className="sidebar-search">
          <svg className="sidebar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
          />
        </div>
      </div>
      <div className="sidebar-list">
        <ConversationList
          conversations={filtered}
          activeId={activeId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
