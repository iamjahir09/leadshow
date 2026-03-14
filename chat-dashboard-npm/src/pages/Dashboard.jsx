import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import ContactPanel from "../components/ContactPanel.jsx";
import { getConversations } from "../services/api.js";

export default function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getConversations()
      .then((data) => {
        setConversations(data);
        if (data.length > 0) setActiveId(data[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleStatusChange(id, newStatus) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  }

  const activeConversation = conversations.find((c) => c.id === activeId);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-6 max-w-md text-center">
          <h2 className="font-bold text-lg mb-2">Connection Error</h2>
          <p className="text-sm opacity-90">{error}</p>
          <p className="text-xs mt-3 text-red-400">
            Make sure your Chatwoot credentials are set in <code>server/.env</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-950">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <ChatWindow conversation={activeConversation} />
      <ContactPanel
        conversation={activeConversation}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
