import ConversationItem from "./ConversationItem.jsx";

export default function ConversationList({ conversations, activeId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center p-6">
        No conversations found.
      </p>
    );
  }
  return (
    <div className="p-2 space-y-1">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
          onClick={() => onSelect(conv.id)}
        />
      ))}
    </div>
  );
}
