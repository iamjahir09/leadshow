import { Search, Hash, Clock } from "lucide-react";
import type { Conversation } from "@workspace/api-client-react";
import { Avatar } from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
}

export function Sidebar({ conversations, activeId, onSelect }: SidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.meta.sender.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 flex-shrink-0 border-r border-border/50 bg-card/40 backdrop-blur-xl flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={`${import.meta.env.BASE_URL}images/logo-mark.png`}
            alt="Logo"
            className="w-8 h-8 rounded-lg shadow-lg shadow-primary/20"
          />
          <h1 className="text-xl font-display font-bold text-foreground">Inbox</h1>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground text-sm">
            No conversations found.
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = activeId === conv.id;
            const lastMessage = conv.messages?.[conv.messages.length - 1];
            
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                    : "hover:bg-secondary/50 border-l-4 border-transparent"
                )}
              >
                <div className="relative">
                  <Avatar 
                    name={conv.meta.sender.name} 
                    url={conv.meta.sender.avatar_url} 
                  />
                  {conv.status === "resolved" && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-background rounded-full" />
                  )}
                  {conv.status === "open" && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-background rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={cn(
                      "font-semibold text-sm truncate pr-2",
                      isActive ? "text-primary" : "text-foreground group-hover:text-primary transition-colors"
                    )}>
                      {conv.meta.sender.name}
                    </span>
                    {conv.last_activity_at && (
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(conv.last_activity_at * 1000), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate pr-2">
                      {lastMessage?.content || "No messages"}
                    </span>
                    {conv.unread_count > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-lg shadow-primary/25">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
