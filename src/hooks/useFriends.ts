import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Friend, FriendRequest, UserSearchResult } from '@/types/friends';
import { API_ROUTES, getSupabaseEdgeFunctionUrl } from '@/components/api/routes';

export const useFriends = () => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFriends = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching friends for user:', user.id);

      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          created_at,
          friend:profiles!friend_id(id, student_id, full_name, avatar_url)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
      
      console.log('Friendships data returned:', data);
      
      setFriends((data || []) as Friend[]);

    } catch (error: any) {
      console.error('Error fetching friends:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load friends'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    if (!user) return;

    try {
      console.log('Fetching friend requests for user:', user.id);
      
      const { data: incoming, error: incomingError } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          updated_at,
          sender:profiles!sender_id(id, student_id, full_name, avatar_url)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (incomingError) {
        console.error('Error fetching incoming requests:', incomingError);
        throw incomingError;
      }
      
      console.log('Incoming requests:', incoming);
      setIncomingRequests((incoming || []) as FriendRequest[]);

      const { data: outgoing, error: outgoingError } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          updated_at,
          receiver:profiles!receiver_id(id, student_id, full_name, avatar_url)
        `)
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (outgoingError) {
        console.error('Error fetching outgoing requests:', outgoingError);
        throw outgoingError;
      }
      
      console.log('Outgoing requests:', outgoing);
      setOutgoingRequests((outgoing || []) as FriendRequest[]);

    } catch (error: any) {
      console.error('Error fetching friend requests:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load friend requests'
      });
    }
  };

  const searchUsers = async (query: string) => {
    if (!user || !query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      console.log('Searching for users with query:', query);
      
      const { data: friendships, error: friendshipError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id);
        
      if (friendshipError) {
        console.error('Error getting friendships:', friendshipError);
        throw friendshipError;
      }
      
      const { data: outgoingReqs, error: outgoingError } = await supabase
        .from('friend_requests')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .eq('status', 'pending');
        
      if (outgoingError) {
        console.error('Error getting outgoing requests:', outgoingError);
        throw outgoingError;
      }
      
      const { data: incomingReqs, error: incomingError } = await supabase
        .from('friend_requests')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
        
      if (incomingError) {
        console.error('Error getting incoming requests:', incomingError);
        throw incomingError;
      }
      
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('id, student_id, full_name, username, avatar_url')
        .or(`student_id.ilike.%${query}%,full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq('id', user.id)
        .limit(20);

      if (searchError) {
        console.error('Error searching for users:', searchError);
        throw searchError;
      }

      console.log('Search results:', profiles);
      
      if (!profiles) {
        setSearchResults([]);
        return;
      }
      
      const friendIds = new Set(friendships?.map(f => f.friend_id) || []);
      const outgoingIds = new Set(outgoingReqs?.map(r => r.receiver_id) || []);
      const incomingIds = new Set(incomingReqs?.map(r => r.sender_id) || []);
      
      const processedResults = profiles.map(profile => {
        let relationshipStatus = null;
        
        if (friendIds.has(profile.id)) {
          relationshipStatus = 'friend';
        } else if (outgoingIds.has(profile.id)) {
          relationshipStatus = 'outgoing_request';
        } else if (incomingIds.has(profile.id)) {
          relationshipStatus = 'incoming_request';
        }
        
        return {
          ...profile,
          relationshipStatus
        };
      });

      console.log('Processed search results with relationship status:', processedResults);
      setSearchResults(processedResults as UserSearchResult[]);
    } catch (error: any) {
      console.error('Error searching for users:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to search for users'
      });
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) return false;

    try {
      console.log('Attempting to send friend request to user:', receiverId);
      
      const { data: existingFriendship, error: friendshipError } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', user.id)
        .eq('friend_id', receiverId)
        .maybeSingle();
        
      if (friendshipError) {
        console.error('Error checking existing friendship:', friendshipError);
        throw friendshipError;
      }
      
      if (existingFriendship) {
        console.log('Users are already friends');
        toast({
          title: 'Already Friends',
          description: 'You are already friends with this user'
        });
        return false;
      }
      
      const { data: existingRequestsFrom, error: checkErrorFrom } = await supabase
        .from('friend_requests')
        .select('id, status')
        .eq('sender_id', user.id)
        .eq('receiver_id', receiverId)
        .maybeSingle();

      if (checkErrorFrom) {
        console.error('Error checking outgoing requests:', checkErrorFrom);
        throw checkErrorFrom;
      }
      
      const { data: existingRequestsTo, error: checkErrorTo } = await supabase
        .from('friend_requests')
        .select('id, status')
        .eq('sender_id', receiverId)
        .eq('receiver_id', user.id)
        .maybeSingle();
        
      if (checkErrorTo) {
        console.error('Error checking incoming requests:', checkErrorTo);
        throw checkErrorTo;
      }

      if (existingRequestsFrom) {
        if (existingRequestsFrom.status === 'pending') {
          console.log('You already sent a friend request to this user');
          toast({
            title: 'Request Already Sent',
            description: 'You have already sent a friend request to this user'
          });
          return false;
        }
        
        if (existingRequestsFrom.status === 'rejected') {
          console.log('Updating previously rejected request');
          const { error: updateError } = await supabase
            .from('friend_requests')
            .update({ status: 'pending', updated_at: new Date().toISOString() })
            .eq('id', existingRequestsFrom.id);
            
          if (updateError) {
            console.error('Error updating rejected request:', updateError);
            throw updateError;
          }
          
          toast({
            title: 'Request Sent',
            description: 'Friend request has been sent'
          });
          
          await fetchFriendRequests();
          return true;
        }
      }
      
      if (existingRequestsTo) {
        if (existingRequestsTo.status === 'pending') {
          console.log('This user has already sent you a friend request');
          toast({
            title: 'Request Pending',
            description: 'This user has already sent you a friend request. Check your request tab.'
          });
          return false;
        }
      }

      console.log('Creating new friend request');
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating friend request:', error);
        
        if (error.code === '23505') {
          toast({
            title: 'Request Already Sent',
            description: 'A friend request has already been sent to this user'
          });
          return false;
        }
        
        throw error;
      }

      // Send SMS notification to receiver if they have enabled SMS notifications
      try {
        // Get receiver's profile to check phone number and notification preferences
        const { data: receiverProfile, error: profileError } = await supabase
          .from('profiles')
          .select('phone_number, sms_notifications, full_name')
          .eq('id', receiverId)
          .single();
          
        if (profileError) {
          console.error('Error fetching receiver profile:', profileError);
        } else if (receiverProfile?.phone_number && receiverProfile?.sms_notifications) {
          // Get sender name for the message
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, username, student_id')
            .eq('id', user.id)
            .single();
            
          const senderName = senderProfile?.full_name || senderProfile?.username || 'Someone';
          const message = `${senderName} sent you a friend request on StudyBuddy. Log in to view details!`;
          
          console.log('Sending SMS notification for friend request to:', receiverProfile.phone_number);
          
          // Get the current session
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          
          if (!accessToken) {
            console.error('No access token available for API request');
            throw new Error('Authentication token not available');
          }
          
          console.log('Using authorization token for API request');
          
          const response = await fetch(getSupabaseEdgeFunctionUrl(API_ROUTES.SEND_SMS), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`, // Add auth token
            },
            body: JSON.stringify({
              to: receiverProfile.phone_number,
              message: message
            }),
          });
          
          const result = await response.json();
          console.log('SMS notification response:', result);
          
          if (!result.success) {
            console.error('SMS notification failed:', result.error);
          }
        } else {
          console.log('SMS notification not sent: receiver has no phone number or notifications disabled');
        }
      } catch (smsError) {
        console.error('Error sending SMS notification for friend request:', smsError);
        // Non-blocking error - continue with the friend request flow
      }

      console.log('Friend request sent successfully');
      toast({
        title: 'Success',
        description: 'Friend request sent'
      });
      
      await fetchFriendRequests();
      return true;
    } catch (error: any) {
      console.error('Error sending friend request:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send friend request'
      });
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    if (!user) return false;

    try {
      console.log('Accepting friend request:', requestId);
      
      const { data: request, error: requestError } = await supabase
        .from('friend_requests')
        .select('id, sender_id, receiver_id')
        .eq('id', requestId)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .single();

      if (requestError) {
        console.error('Error getting friend request:', requestError);
        throw requestError;
      }
      
      console.log('Friend request to accept:', request);

      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ 
          status: 'accepted', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error updating friend request status:', updateError);
        throw updateError;
      }

      try {
        const { error: friendshipError1 } = await supabase
          .from('friendships')
          .insert({
            user_id: user.id,
            friend_id: request.sender_id
          });

        if (friendshipError1) {
          console.error('Error creating first friendship record:', friendshipError1);
          throw friendshipError1;
        }
      } catch (error) {
        console.error('Exception creating first friendship:', error);
        throw error;
      }

      try {
        const { error: friendshipError2 } = await supabase
          .from('friendships')
          .insert({
            user_id: request.sender_id,
            friend_id: user.id
          });

        if (friendshipError2) {
          console.error('Error creating second friendship record:', friendshipError2);
          try {
            await supabase
              .from('friendships')
              .delete()
              .eq('user_id', user.id)
              .eq('friend_id', request.sender_id);
          } catch (cleanupError) {
            console.error('Failed to clean up first friendship after error:', cleanupError);
          }
          throw friendshipError2;
        }
      } catch (error) {
        console.error('Exception creating second friendship:', error);
        throw error;
      }

      // Send notification to both users about the accepted friend request
      try {
        // Get profiles for both users
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, phone_number, sms_notifications, full_name, username')
          .in('id', [user.id, request.sender_id]);
          
        if (profilesError) {
          console.error('Error fetching user profiles for notifications:', profilesError);
        } else {
          // Get the current session for authorization
          const { data: { session } } = await supabase.auth.getSession();
          const accessToken = session?.access_token;
          
          if (!accessToken) {
            console.error('No access token available for API request');
            throw new Error('Authentication token not available');
          }
          
          console.log('Using authorization token for API request');
          
          // Process both the sender and receiver for potential notifications
          for (const profile of profiles || []) {
            if (profile.phone_number && profile.sms_notifications) {
              // Determine which message to send based on whether this is the sender or receiver
              const isSender = profile.id === request.sender_id;
              const otherUser = profiles?.find(p => p.id !== profile.id);
              const otherName = otherUser?.full_name || otherUser?.username || 'Someone';
              
              const message = isSender
                ? `Your friend request to ${otherName} has been accepted on StudyBuddy. Start collaborating now!`
                : `You've accepted ${otherName}'s friend request on StudyBuddy. Start collaborating now!`;
              
              console.log(`Sending SMS notification about accepted friend request to: ${profile.phone_number}`);
              
              const response = await fetch(getSupabaseEdgeFunctionUrl(API_ROUTES.SEND_SMS), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`, // Add auth token
                },
                body: JSON.stringify({
                  to: profile.phone_number,
                  message: message
                }),
              });
              
              const result = await response.json();
              console.log('SMS notification response:', result);
              
              if (!result.success) {
                console.error('SMS notification failed:', result.error);
              }
            } else {
              console.log(`SMS notification not sent to user ${profile.id}: no phone number or notifications disabled`);
            }
          }
        }
      } catch (smsError) {
        console.error('Error sending SMS notifications for accepted friend request:', smsError);
        // Non-blocking error - continue with the friend acceptance flow
      }

      try {
        const { error: activityError } = await supabase
          .from('recent_activity')
          .insert({
            user_id: user.id,
            type: 'system',
            content: 'You accepted a friend request'
          });
          
        if (activityError) {
          console.error('Error adding activity record, but friendship was created:', activityError);
        }
      } catch (activityError) {
        console.error('Exception while adding activity record:', activityError);
      }

      console.log('Friend request accepted successfully');
      toast({
        title: 'Success',
        description: 'Friend request accepted'
      });
      
      await fetchFriendRequests();
      await fetchFriends();
      return true;
    } catch (error: any) {
      console.error('Error accepting friend request:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to accept friend request'
      });
      return false;
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ 
          status: 'rejected', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Friend request rejected'
      });
      
      await fetchFriendRequests();
      return true;
    } catch (error: any) {
      console.error('Error rejecting friend request:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject friend request'
      });
      return false;
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId)
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Friend request cancelled'
      });
      
      await fetchFriendRequests();
      return true;
    } catch (error: any) {
      console.error('Error cancelling friend request:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to cancel friend request'
      });
      return false;
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return false;

    try {
      const { error: error1 } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', friendId);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', user.id);

      if (error2) throw error2;

      toast({
        title: 'Success',
        description: 'Friend removed'
      });
      
      await fetchFriends();
      return true;
    } catch (error: any) {
      console.error('Error removing friend:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove friend'
      });
      return false;
    }
  };

  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscriptions for user:', user.id);
    
    const requestsChannel = supabase
      .channel('friend-requests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'friend_requests',
        filter: `sender_id=eq.${user.id}`,
      }, (payload) => {
        console.log('Realtime update for sent friend request:', payload);
        fetchFriendRequests();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'friend_requests',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        console.log('Realtime update for received friend request:', payload);
        fetchFriendRequests();
      })
      .subscribe();

    const friendshipsChannel = supabase
      .channel('friendships-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'friendships',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        console.log('Realtime update for friendship:', payload);
        fetchFriends();
      })
      .subscribe();

    console.log('Realtime subscriptions set up successfully');
    
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(friendshipsChannel);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  return {
    loading,
    searchLoading,
    friends,
    incomingRequests,
    outgoingRequests,
    searchResults,
    fetchFriends,
    fetchFriendRequests,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend,
    setSearchResults
  };
};

export type { Friend, FriendRequest, UserSearchResult };
