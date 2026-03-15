import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import ContactPanel from "../components/ContactPanel.jsx";
import { getConversations } from "../services/api.js";

export default function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  }

  useEffect(() => {
    getConversations()
      .then((data) => {
        setConversations(data);
        if (data.length > 0) setActiveId(data[0].id);
      })
      .catch((err) => setError(err.response?.data?.error || err.message))
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
      <div className="screen-center">
        <div className="spinner" />
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading your workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen-center">
        <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: 14, padding: "20px 24px", maxWidth: 380, textAlign: "center", color: "#fca5a5" }}>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Error</h2>
          <p style={{ fontSize: 13 }}>{error}</p>
          <button onClick={handleLogout} style={{ marginTop: 14, padding: "8px 20px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border-light)", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
            Logout & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => { setActiveId(id); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        email={email}
        onLogout={handleLogout}
      />
      <ChatWindow
        conversation={activeConversation}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <ContactPanel
        conversation={activeConversation}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
