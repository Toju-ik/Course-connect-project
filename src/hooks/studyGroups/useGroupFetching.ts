
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { StudyGroup, GroupMember, GroupMessage } from '@/types/studyGroups';

export const useGroupFetching = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [groupMembers, setGroupMembers] = useState<Record<string, GroupMember[]>>({});
  const { toast } = useToast();

  // Setup a group memberships realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('group-memberships-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_memberships'
      }, (payload) => {
        console.log('Group membership changed:', payload);
        
        const groupId = payload.new ? (payload.new as Record<string, any>).group_id : 
                        payload.old ? (payload.old as Record<string, any>).group_id : 
                        undefined;
        
        if (groupId) {
          fetchGroupMembers(groupId);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudyGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedGroups: StudyGroup[] = data?.map(group => ({
        id: group.id,
        study_group_name: group.study_group_name,
        description: group.description,
        created_by: group.created_by,
        created_at: group.created_at
      })) || [];
      
      setStudyGroups(formattedGroups);
      
      for (const group of formattedGroups) {
        await fetchGroupMembers(group.id);
      }
      
      return formattedGroups;
    } catch (error: any) {
      console.error('Error fetching study groups:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load study groups.',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('group_memberships')
        .select('group_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const groupIds = data.map(item => item.group_id);
        const { data: myGroupsData, error: myGroupsError } = await supabase
          .from('study_groups')
          .select('*')
          .in('id', groupIds)
          .order('created_at', { ascending: false });
          
        if (myGroupsError) throw myGroupsError;
        
        const formattedGroups: StudyGroup[] = myGroupsData?.map(group => ({
          id: group.id,
          study_group_name: group.study_group_name,
          description: group.description,
          created_by: group.created_by,
          created_at: group.created_at
        })) || [];
        
        setMyGroups(formattedGroups);
        
        for (const group of formattedGroups) {
          await fetchGroupMembers(group.id);
        }
        
        return formattedGroups;
      } else {
        setMyGroups([]);
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching my groups:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your groups.',
      });
      return [];
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      console.log(`Fetching members for group: ${groupId}`);
      
      const { data: memberships, error: membershipError } = await supabase
        .from('group_memberships')
        .select('user_id')
        .eq('group_id', groupId);

      if (membershipError) throw membershipError;

      if (memberships && memberships.length > 0) {
        const userIds = memberships.map(membership => membership.user_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, student_id, full_name, username, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;
        
        console.log(`Found ${profiles?.length || 0} members for group ${groupId}`);
        
        setGroupMembers(prevMembers => ({
          ...prevMembers,
          [groupId]: profiles || []
        }));
        
        return profiles || [];
      } else {
        console.log(`No members found for group ${groupId}`);
        setGroupMembers(prevMembers => ({
          ...prevMembers,
          [groupId]: []
        }));
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching group members:', error.message);
      return [];
    }
  };

  const fetchGroupMessages = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching group messages:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load group messages.',
      });
      return [];
    }
  };

  return {
    loading,
    studyGroups,
    myGroups,
    groupMembers,
    fetchStudyGroups,
    fetchMyGroups,
    fetchGroupMembers,
    fetchGroupMessages
  };
};
