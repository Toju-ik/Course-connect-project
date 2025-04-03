
import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Users, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileLayout from "@/components/layouts/MobileLayout";
import { UserSearch } from '@/components/friends/UserSearch';
import FriendsList from '@/components/friends/FriendsList';
import { FriendRequestsList } from '@/components/friends/FriendRequestsList';
import { useFriends } from '@/hooks/useFriends';
import { useToast } from '@/hooks/use-toast';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const {
    loading,
    searchLoading,
    friends,
    incomingRequests,
    outgoingRequests,
    searchResults,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend,
    setSearchResults
  } = useFriends();

  const handleSearch = useCallback(async (query: string) => {
    console.log('Handling search for:', query);
    if (!query.trim()) {
      toast({
        title: 'Search Error',
        description: 'Please enter a search term',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await searchUsers(query);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Failed',
        description: 'An error occurred while searching for users',
        variant: 'destructive'
      });
    }
  }, [searchUsers, toast]);

  const handleSendRequest = useCallback(async (userId: string) => {
    console.log('Sending friend request to:', userId);
    try {
      const success = await sendFriendRequest(userId);
      
      if (success) {
        // Remove the user from search results after successful request
        setSearchResults(prev => prev.filter(user => user.id !== userId));
      }
      
      return success;
    } catch (error) {
      console.error('Failed to send friend request:', error);
      toast({
        title: 'Request Failed',
        description: 'Failed to send friend request',
        variant: 'destructive'
      });
      return false;
    }
  }, [sendFriendRequest, toast, setSearchResults]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const pendingRequestsCount = incomingRequests.length;

  return (
    <MobileLayout title="Friends">
      <div className="container-pad py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              Friends
            </h1>
            <p className="text-gray-600 mt-1">
              Connect with other students and collaborate on your studies
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="friends">My Friends</TabsTrigger>
                <TabsTrigger value="requests" className="relative">
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingRequestsCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="search">Find Friends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="friends" className="mt-0">
                <FriendsList
                  friends={friends}
                  isLoading={loading}
                  onRemoveFriend={removeFriend}
                />
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <div className="space-y-6">
                  {incomingRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        Incoming Requests
                      </h3>
                      <FriendRequestsList
                        requests={incomingRequests}
                        isLoading={loading}
                        onAccept={acceptFriendRequest}
                        onReject={rejectFriendRequest}
                        onCancel={cancelFriendRequest}
                      />
                    </div>
                  )}
                  
                  {outgoingRequests.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Sent Requests</h3>
                      <FriendRequestsList
                        requests={outgoingRequests}
                        isLoading={loading}
                        onAccept={acceptFriendRequest}
                        onReject={rejectFriendRequest}
                        onCancel={cancelFriendRequest}
                      />
                    </div>
                  )}
                  
                  {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell size={48} className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium">No pending requests</h3>
                      <p className="text-sm text-gray-500 mt-2">
                        When you send or receive friend requests, they will appear here
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="search" className="mt-0">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Find Friends
                  </h3>
                  <UserSearch
                    onSearch={handleSearch}
                    onSendRequest={handleSendRequest}
                    searchResults={searchResults}
                    isSearching={searchLoading}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Friends;
