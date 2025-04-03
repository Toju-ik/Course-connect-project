
import { useState, useEffect } from 'react';
import { StudyGroup, GroupMessage, GroupMember } from '@/types/studyGroups';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Friend } from '@/types/friends';
import { GroupHeader } from './group-details/GroupHeader';
import { GroupMessageList } from './group-details/GroupMessageList';
import { GroupMembersList } from './group-details/GroupMembersList';
import { GroupInfo } from './group-details/GroupInfo';

interface GroupDetailsProps {
  group: StudyGroup;
  messages: GroupMessage[];
  members: GroupMember[];
  onBack: () => void;
  onSendMessage: (message: string) => Promise<boolean>;
  onDeleteMessage: (messageId: string) => Promise<boolean>;
  onLeaveGroup: (groupId: string) => Promise<boolean>;
  onAddMember?: (userId: string) => Promise<boolean>;
}

export const GroupDetails = ({
  group,
  messages,
  members,
  onBack,
  onSendMessage,
  onDeleteMessage,
  onLeaveGroup,
  onAddMember
}: GroupDetailsProps) => {
  const [isCreator, setIsCreator] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && group) {
      setIsCreator(user.id === group.created_by);
    }
  }, [user, group]);

  useEffect(() => {
    if (user && isCreator) {
      fetchFriends();
    }
  }, [user, isCreator]);

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      setLoadingFriends(true);
      
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          created_at,
          friend:profiles!friend_id(id, student_id, full_name, username, avatar_url)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setFriends(data || []);
    } catch (error: any) {
      console.error('Error fetching friends:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load friends'
      });
    } finally {
      setLoadingFriends(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <GroupHeader 
        group={group} 
        memberCount={members.length} 
        onBack={onBack} 
        onLeaveGroup={onLeaveGroup} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
        <GroupMessageList 
          messages={messages} 
          members={members} 
          onSendMessage={onSendMessage} 
          onDeleteMessage={onDeleteMessage} 
        />

        <div className="md:col-span-1">
          <GroupMembersList 
            group={group} 
            members={members} 
            isCreator={isCreator} 
            friends={friends} 
            loadingFriends={loadingFriends}
            onAddMember={onAddMember}
          />
          <GroupInfo group={group} />
        </div>
      </div>
    </div>
  );
};
