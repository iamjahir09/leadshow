import ConversationItem from "./ConversationItem.jsx";

export default function ConversationList({ conversations, activeId, onSelect }) {
  if (conversations.length === 0) {
    return <div className="conv-empty">No conversations found.</div>;
  }
  return (
    <>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
          onClick={() => onSelect(conv.id)}
        />
      ))}
    </>
  );
}
