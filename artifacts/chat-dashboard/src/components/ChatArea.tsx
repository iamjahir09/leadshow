import { useState, useRef, useEffect } from "react";
import { Send, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import type { Conversation, Message } from "@workspace/api-client-react";
import { useGetMessages, useChatMutations } from "@/hooks/use-chat";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface ChatAreaProps {
  conversation: Conversation;
}

export function ChatArea({ conversation }: ChatAreaProps) {
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { data: messages, isLoading } = useGetMessages(conversation.id);
  const { sendMessage, toggleStatus } = useChatMutations();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation.id]);

  const handleSend = () => {
    if (!content.trim() || sendMessage.isPending) return;
    
    sendMessage.mutate({
      data: {
        conversationId: conversation.id,
        content: content.trim()
      }
    });
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative z-10 shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/60 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Avatar 
            name={conversation.meta.sender.name} 
            url={conversation.meta.sender.avatar_url}
            size="sm"
          />
          <div>
            <h2 className="font-display font-semibold text-foreground leading-tight">
              {conversation.meta.sender.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Conversation #{conversation.id}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => toggleStatus.mutate({ 
            data: { 
              conversationId: conversation.id, 
              status: conversation.status === "open" ? "resolved" : "open" 
            } 
          })}
          disabled={toggleStatus.isPending}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
            conversation.status === "open" 
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:scale-105"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          {conversation.status === "open" ? (
            <><CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved</>
          ) : (
            <><Circle className="w-3.5 h-3.5" /> Reopen</>
          )}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages?.map((msg: Message) => {
              const isOutgoing = msg.message_type === 1;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex flex-col max-w-[75%]",
                    isOutgoing ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap",
                      isOutgoing
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm shadow-primary/20"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1.5 px-1 font-medium">
                    {format(new Date(msg.created_at * 1000), "MMM d, h:mm a")}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/60 backdrop-blur-xl border-t border-border/50 shrink-0">
        <div className="relative flex items-end gap-2 bg-background rounded-2xl border border-border p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-sm py-2.5 px-3 custom-scrollbar placeholder:text-muted-foreground"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!content.trim() || sendMessage.isPending}
            className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {sendMessage.isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2 font-medium">
          Press <kbd className="px-1 py-0.5 bg-secondary rounded border border-border mx-0.5">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-secondary rounded border border-border mx-0.5">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
