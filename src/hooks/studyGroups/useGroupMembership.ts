
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { StudyGroup } from '@/types/studyGroups';
import { API_ROUTES, getSupabaseEdgeFunctionUrl } from '@/components/api/routes';

export const useGroupMembership = (
  user: User | null,
  fetchMyGroups: () => Promise<any>,
  fetchGroupMembers: (groupId: string) => Promise<any>,
  currentGroup: StudyGroup | null
) => {
  const { toast } = useToast();

  const joinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to join a study group.',
      });
      return false;
    }

    try {
      const { data: existingMembership, error: checkError } = await supabase
        .from('group_memberships')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) throw checkError;
      
      if (existingMembership) {
        toast({
          title: 'Already a member',
          description: 'You are already a member of this group.',
        });
        return true;
      }

      const { error } = await supabase
        .from('group_memberships')
        .insert({
          group_id: groupId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'You have joined the study group.',
      });
      
      await fetchMyGroups();
      await fetchGroupMembers(groupId);
      
      return true;
    } catch (error: any) {
      console.error('Error joining study group:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to join study group.',
      });
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('group_memberships')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'You have left the study group.',
      });
      
      await fetchMyGroups();
      
      return true;
    } catch (error: any) {
      console.error('Error leaving study group:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to leave study group.',
      });
      return false;
    }
  };

  const addGroupMember = async (groupId: string, userId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to add members to a study group.',
      });
      return false;
    }

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .select('id, created_by, study_group_name')
        .eq('id', groupId)
        .single();

      if (groupError) {
        console.error('Error fetching group:', groupError.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to verify group ownership.',
        });
        return false;
      }

      if (groupData.created_by !== user.id) {
        toast({
          variant: 'destructive',
          title: 'Permission denied',
          description: 'Only the group creator can add members.',
        });
        return false;
      }

      try {
        const { data: existingMembership, error: checkError } = await supabase
          .from('group_memberships')
          .select('*')
          .eq('group_id', groupId)
          .eq('user_id', userId)
          .maybeSingle();

        if (checkError) throw checkError;
        
        if (existingMembership) {
          toast({
            title: 'User already a member',
            description: 'This user is already a member of the group.',
          });
          return false;
        }

        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number, sms_notifications, full_name')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError.message);
        }

        const { error } = await supabase
          .from('group_memberships')
          .insert({
            group_id: groupId,
            user_id: userId,
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'User has been added to the group.',
        });
        
        await fetchGroupMembers(groupId);
        
        if (userProfile && userProfile.phone_number && userProfile.sms_notifications) {
          try {
            console.log('Sending SMS notification to new group member');
            
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;
            
            if (!accessToken) {
              console.error('No access token available for API authentication');
              return true; // Continue even without sending SMS
            }
            
            const groupName = groupData.study_group_name;
            const message = `You have been added to the study group "${groupName}". Login to view!`;
            
            console.log('Sending SMS with auth token:', accessToken?.substring(0, 10) + '...');
            
            const response = await fetch(getSupabaseEdgeFunctionUrl(API_ROUTES.SEND_SMS), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                to: userProfile.phone_number,
                message: message
              }),
            });
            
            const result = await response.json();
            console.log('SMS notification response:', result);
            
            if (!result.success) {
              console.error('SMS notification failed:', result.error);
            }
          } catch (smsError) {
            console.error('Error sending SMS notification:', smsError);
          }
        } else {
          console.log('SMS notification not sent: user has no phone number or notifications disabled');
          if (userProfile) {
            console.log('User profile details:', {
              hasPhoneNumber: !!userProfile.phone_number,
              smsNotificationsEnabled: userProfile.sms_notifications
            });
          }
        }
        
        return true;
      } catch (error: any) {
        console.error('Error adding member to group:', error.message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add member to the group.',
        });
        return false;
      }
    } catch (error: any) {
      console.error('Error adding member to group:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add member to the group.',
      });
      return false;
    }
  };

  const isGroupMember = (groupId: string) => {
    if (!user) return false;
    return !!supabase
      .from('group_memberships')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => data);
  };

  return {
    joinGroup,
    leaveGroup,
    addGroupMember,
    isGroupMember
  };
};
