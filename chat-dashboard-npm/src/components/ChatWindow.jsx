import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import { getMessages, sendMessage } from "../services/api.js";

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversation) return;
    setLoading(true);
    getMessages(conversation.id)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(content) {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage(conversation.id, content);
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  const sender = conversation.meta?.sender;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-w-0">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-900 flex items-center gap-3">
        <div>
          <h2 className="font-semibold text-slate-100">{sender?.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">#{conversation.id}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                conversation.status === "open"
                  ? "bg-green-600/20 text-green-400"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {conversation.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">No messages yet.</p>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
