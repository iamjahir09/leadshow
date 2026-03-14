import { useState, useEffect } from "react";
import { useChatQueries } from "@/hooks/use-chat";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { ContactPanel } from "@/components/ContactPanel";

export default function Dashboard() {
  const { conversationsQuery } = useChatQueries();
  const [activeId, setActiveId] = useState<number | null>(null);

  const conversations = conversationsQuery.data || [];
  const activeConversation = conversations.find(c => c.id === activeId);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  if (conversationsQuery.isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-display font-semibold text-foreground animate-pulse">
          Loading Workspace...
        </h2>
      </div>
    );
  }

  if (conversationsQuery.isError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-md text-center border border-destructive/20 shadow-xl shadow-destructive/10">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-sm opacity-90">Failed to connect to the chat server. Please ensure the backend is running and properly configured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* 3-Column Layout */}
      <Sidebar 
        conversations={conversations} 
        activeId={activeId} 
        onSelect={setActiveId} 
      />
      
      {activeConversation ? (
        <>
          <ChatArea conversation={activeConversation} />
          <ContactPanel conversation={activeConversation} />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <img 
            src={`${import.meta.env.BASE_URL}images/empty-state.png`}
            alt="Empty State"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
          <div className="relative z-10 text-center p-8 bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo-mark.png`}
              alt="Logo"
              className="w-16 h-16 mx-auto mb-6 rounded-2xl shadow-lg shadow-primary/20"
            />
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Ready to chat?
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Select a conversation from the sidebar to view messages, reply to users, and resolve inquiries.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
