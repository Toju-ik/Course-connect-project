
import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupMessage, GroupMember } from '@/types/studyGroups';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

interface GroupMessageListProps {
  messages: GroupMessage[];
  members: GroupMember[];
  onSendMessage: (message: string) => Promise<boolean>;
  onDeleteMessage: (messageId: string) => Promise<boolean>;
}

export const GroupMessageList = ({ 
  messages, 
  members, 
  onSendMessage, 
  onDeleteMessage 
}: GroupMessageListProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const getDisplayName = (userId: string) => {
    const member = members.find(m => m.id === userId);
    if (member?.username) return member.username;
    return member?.full_name || member?.student_id || 'Anonymous';
  };

  const getInitials = (userId: string) => {
    const name = getDisplayName(userId);
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarUrl = (userId: string) => {
    const member = members.find(m => m.id === userId);
    return member?.avatar_url || null;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    console.log('[GroupMessageList] Attempting to send message:', newMessage);
    
    try {
      setSending(true);
      console.log('[GroupMessageList] Calling onSendMessage callback...');
      
      const success = await onSendMessage(newMessage);
      console.log('[GroupMessageList] Message send result:', success);
      
      if (success) {
        setNewMessage('');
        toast({
          title: "Success",
          description: "Message sent successfully",
          variant: "default"
        });
      } else {
        console.error('[GroupMessageList] Failed to send message: onSendMessage returned false');
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[GroupMessageList] Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    console.log('[GroupMessageList] Attempting to delete message:', messageId);
    try {
      const success = await onDeleteMessage(messageId);
      if (success) {
        toast({
          title: "Success",
          description: "Message deleted successfully",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[GroupMessageList] Error deleting message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="md:col-span-2 flex flex-col bg-gray-50 rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Send className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No messages yet. Be the first to send a message!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${msg.user_id === user?.id ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                  <Avatar className="h-8 w-8 mr-2">
                    {getAvatarUrl(msg.user_id) ? (
                      <AvatarImage src={getAvatarUrl(msg.user_id) || ''} />
                    ) : (
                      <AvatarFallback>{getInitials(msg.user_id)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`${msg.user_id === user?.id ? 'mr-2' : 'ml-2'}`}>
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">{getDisplayName(msg.user_id)}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                      {msg.user_id === user?.id && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 ml-1 text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className={`rounded-lg py-2 px-3 ${
                      msg.user_id === user?.id 
                        ? 'bg-primary text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              console.log('[GroupMessageList] Message input updated:', e.target.value);
            }}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || sending}
            className={sending ? "opacity-70" : ""}
          >
            <Send className="h-4 w-4 mr-1" />
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};
