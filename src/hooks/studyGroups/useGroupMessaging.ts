import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { StudyGroup } from '@/types/studyGroups';
import { getSupabaseEdgeFunctionUrl, API_ROUTES } from '@/components/api/routes';

export const useGroupMessaging = (
  user: User | null,
  currentGroup: StudyGroup | null,
  fetchGroupMessages: (groupId: string) => Promise<any>
) => {
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!user || !currentGroup) {
      console.error('[useGroupMessaging] Cannot send message: user or currentGroup is null');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You need to be logged in and have a group selected to send messages.',
      });
      return false;
    }

    try {
      console.log('[useGroupMessaging] Sending message to group:', currentGroup.id);
      console.log('[useGroupMessaging] Current user:', user.id);
      console.log('[useGroupMessaging] Message content:', message);
      
      const { data: membershipData, error: membershipError } = await supabase
        .from('group_memberships')
        .select('*')
        .eq('group_id', currentGroup.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (membershipError) {
        console.error('[useGroupMessaging] Error checking group membership:', membershipError);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to verify group membership.',
        });
        return false;
      }
      
      if (!membershipData) {
        console.error('[useGroupMessaging] User is not a member of this group');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You must be a member of this group to send messages.',
        });
        return false;
      }
      
      console.log('[useGroupMessaging] Confirmed user is a group member, proceeding with message insert');
      
      const { data, error } = await supabase
        .from('group_messages')
        .insert({
          group_id: currentGroup.id,
          user_id: user.id,
          message: message,
        });

      if (error) {
        console.error('[useGroupMessaging] Error sending message:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to send message: ${error.message}`,
        });
        return false;
      }
      
      console.log('[useGroupMessaging] Message inserted successfully, data:', data);
      
      // Manually send SMS notifications - this would be in addition to the database trigger
      await sendSmsNotificationsForMessage(currentGroup.id, user.id, message);
      
      console.log('[useGroupMessaging] Fetching updated messages');
      
      await fetchGroupMessages(currentGroup.id);
      return true;
    } catch (error: any) {
      console.error('[useGroupMessaging] Exception when sending message:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Exception: ${error.message}`,
      });
      return false;
    }
  };

  const sendSmsNotificationsForMessage = async (groupId: string, senderId: string, messageContent: string) => {
    try {
      // First, get the sender's profile to include their name/username in notifications
      const { data: senderProfile, error: senderError } = await supabase
        .from('profiles')
        .select('username, student_id, full_name')
        .eq('id', senderId)
        .single();
      
      if (senderError) {
        console.error('[useGroupMessaging] Error fetching sender profile:', senderError);
        return;
      }
      
      // Use username, student_id, or full_name in this priority order
      const senderName = senderProfile?.username || senderProfile?.student_id || senderProfile?.full_name || 'A group member';
      
      // First, get user IDs of all members in the group except the sender
      const { data: memberIds, error: memberIdsError } = await supabase
        .from('group_memberships')
        .select('user_id')
        .eq('group_id', groupId)
        .neq('user_id', senderId);
      
      if (memberIdsError) {
        console.error('[useGroupMessaging] Error fetching group member IDs:', memberIdsError);
        return;
      }
      
      if (!memberIds || memberIds.length === 0) {
        console.log('[useGroupMessaging] No other members in this group');
        return;
      }
      
      // Extract the user IDs to an array
      const userIds = memberIds.map(member => member.user_id);
      
      // Then, get profile information for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, phone_number, sms_notifications')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('[useGroupMessaging] Error fetching member profiles:', profilesError);
        return;
      }
      
      console.log('[useGroupMessaging] Found eligible recipients:', profiles);
      
      // Get group name for the notification
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .select('study_group_name')
        .eq('id', groupId)
        .single();
      
      if (groupError) {
        console.error('[useGroupMessaging] Error fetching group name:', groupError);
        return;
      }
      
      const groupName = groupData?.study_group_name || 'your study group';
      
      // Create a preview of the message (first 50 chars)
      let messagePreview = messageContent.substring(0, 50);
      if (messageContent.length > 50) {
        messagePreview += '...';
      }
      
      // SMS message template
      const smsMessage = `New message in ${groupName} from ${senderName}: "${messagePreview}"`;
      
      // Send SMS to each eligible recipient
      if (profiles && profiles.length > 0) {
        for (const profile of profiles) {
          if (profile.phone_number && profile.sms_notifications) {
            console.log(`[useGroupMessaging] Sending SMS to user ${profile.id} at ${profile.phone_number}`);
            
            // Call the Supabase Edge Function to send SMS
            const response = await supabase.functions.invoke(API_ROUTES.SEND_SMS, {
              body: {
                to: profile.phone_number,
                message: smsMessage
              }
            });
            
            if (!response.error) {
              console.log(`[useGroupMessaging] SMS sent successfully to ${profile.phone_number}`);
            } else {
              console.error(`[useGroupMessaging] Failed to send SMS:`, response.error);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('[useGroupMessaging] Error sending SMS notifications:', error.message);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user || !currentGroup) {
      console.error('[useGroupMessaging] Cannot delete message: user or currentGroup is null');
      return false;
    }

    try {
      console.log('[useGroupMessaging] Deleting message:', messageId, 'by user:', user.id);
      
      const { error } = await supabase
        .from('group_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) {
        console.error('[useGroupMessaging] Error deleting message:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to delete message: ${error.message}`,
        });
        return false;
      }
      
      console.log('[useGroupMessaging] Message deleted successfully, fetching updated messages');
      await fetchGroupMessages(currentGroup.id);
      return true;
    } catch (error: any) {
      console.error('[useGroupMessaging] Exception when deleting message:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Exception: ${error.message}`,
      });
      return false;
    }
  };

  return {
    sendMessage,
    deleteMessage
  };
};
