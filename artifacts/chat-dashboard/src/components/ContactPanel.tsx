import { Mail, Phone, MapPin, Hash, User, Briefcase, Calendar } from "lucide-react";
import type { Conversation } from "@workspace/api-client-react";
import { Avatar } from "./Avatar";
import { format } from "date-fns";

interface ContactPanelProps {
  conversation: Conversation;
}

export function ContactPanel({ conversation }: ContactPanelProps) {
  const { sender } = conversation.meta;

  return (
    <div className="w-72 flex-shrink-0 border-l border-border/50 bg-card/40 backdrop-blur-xl flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="p-8 flex flex-col items-center text-center border-b border-border/50">
        <Avatar 
          name={sender.name} 
          url={sender.avatar_url} 
          size="xl" 
          className="mb-4 ring-4 ring-background shadow-2xl"
        />
        <h2 className="text-xl font-display font-bold text-foreground mb-1">
          {sender.name}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-secondary/50 px-3 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full ${conversation.status === 'open' ? 'bg-primary' : 'bg-emerald-500'}`} />
          {conversation.status === 'open' ? 'Active Conversation' : 'Resolved'}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            Contact Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Email</p>
                <p className="text-sm text-foreground break-all">
                  {sender.email || "Not provided"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Phone</p>
                <p className="text-sm text-foreground">
                  {sender.phone_number || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Metadata
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-foreground font-medium">#{sender.id}</span>
            </div>
            {conversation.last_activity_at && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Active</span>
                <span className="text-foreground font-medium text-right">
                  {format(new Date(conversation.last_activity_at * 1000), "MMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
