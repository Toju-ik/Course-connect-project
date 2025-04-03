
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StudyGroup, GroupMembership, GroupMessage, GroupMember } from '@/types/studyGroups';
import { useGroupFetching } from './useGroupFetching';
import { useGroupManagement } from './useGroupManagement';
import { useGroupMessaging } from './useGroupMessaging';
import { useGroupMembership } from './useGroupMembership';

export const useStudyGroups = () => {
  const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const { user } = useAuth();
  
  const { 
    loading, 
    studyGroups, 
    myGroups, 
    groupMembers, 
    fetchStudyGroups, 
    fetchMyGroups, 
    fetchGroupMembers,
    fetchGroupMessages
  } = useGroupFetching(user);
  
  const { 
    createStudyGroup
  } = useGroupManagement(user, fetchStudyGroups, fetchMyGroups);
  
  const { 
    sendMessage, 
    deleteMessage 
  } = useGroupMessaging(user, currentGroup, fetchGroupMessages);
  
  const { 
    joinGroup, 
    leaveGroup, 
    addGroupMember,
    isGroupMember 
  } = useGroupMembership(user, fetchMyGroups, fetchGroupMembers, currentGroup);

  const selectGroup = async (group: StudyGroup) => {
    setCurrentGroup(group);
    const messages = await fetchGroupMessages(group.id);
    setGroupMessages(messages || []);
    await fetchGroupMembers(group.id);
  };

  const clearSelection = () => {
    setCurrentGroup(null);
    setGroupMessages([]);
  };

  useEffect(() => {
    fetchStudyGroups();
    if (user) {
      fetchMyGroups();
    }
  }, [user]);

  // Set up realtime subscriptions for group messages when a group is selected
  useEffect(() => {
    if (!currentGroup) return;

    const channel = supabase
      .channel('group-messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${currentGroup.id}`
      }, () => {
        fetchGroupMessages(currentGroup.id).then(messages => {
          if (messages) setGroupMessages(messages);
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGroup]);

  // Set up realtime subscriptions for group memberships when a group is selected
  useEffect(() => {
    if (!currentGroup) return;

    const channel = supabase
      .channel('group-memberships')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_memberships',
        filter: `group_id=eq.${currentGroup.id}`
      }, () => {
        fetchGroupMembers(currentGroup.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGroup]);

  return {
    loading,
    studyGroups,
    myGroups,
    groupMembers,
    currentGroup,
    groupMessages,
    fetchStudyGroups,
    fetchMyGroups,
    createStudyGroup,
    joinGroup,
    leaveGroup,
    selectGroup,
    clearSelection,
    isGroupMember,
    fetchGroupMessages,
    sendMessage,
    deleteMessage,
    fetchGroupMembers,
    addGroupMember
  };
};

// Import is needed for realtime subscriptions
import { supabase } from '@/lib/supabase';
