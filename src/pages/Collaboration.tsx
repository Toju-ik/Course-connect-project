
import { useState } from 'react';
import { useStudyGroups } from '@/hooks/studyGroups';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateGroupDialog } from '@/components/collaboration/CreateGroupDialog';
import { GroupsList } from '@/components/collaboration/GroupsList';
import { GroupDetails } from '@/components/collaboration/GroupDetails';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/mobile/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState('all-groups');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    studyGroups,
    myGroups,
    loading,
    currentGroup,
    groupMembers,
    groupMessages,
    createStudyGroup,
    joinGroup,
    leaveGroup,
    selectGroup,
    clearSelection,
    sendMessage,
    deleteMessage,
    addGroupMember,
  } = useStudyGroups();

  const handleCreateGroup = async (name: string, description: string) => {
    await createStudyGroup(name, description);
  };

  const getCurrentGroupMembers = () => {
    return currentGroup ? (groupMembers[currentGroup.id] || []) : [];
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Collaboration" />
      
      <div className="container-pad">
        {currentGroup ? (
          <GroupDetails
            group={currentGroup}
            messages={groupMessages}
            members={getCurrentGroupMembers()}
            onBack={clearSelection}
            onSendMessage={sendMessage}
            onDeleteMessage={deleteMessage}
            onLeaveGroup={leaveGroup}
            onAddMember={(userId) => addGroupMember(currentGroup.id, userId)}
          />
        ) : (
          <motion.div
            className="py-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary" />
                  Study Groups
                </h1>
                <p className="text-gray-600 mt-1">
                  Join study groups to collaborate with other students or create your own.
                </p>
              </div>
              <CreateGroupDialog onCreate={handleCreateGroup} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all-groups">All Groups</TabsTrigger>
                  <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all-groups" className="mt-0">
                  <GroupsList
                    groups={studyGroups}
                    myGroups={myGroups}
                    isLoading={loading}
                    onSelect={selectGroup}
                    onJoin={joinGroup}
                    onLeave={leaveGroup}
                    groupMembers={groupMembers}
                  />
                </TabsContent>
                
                <TabsContent value="my-groups" className="mt-0">
                  <GroupsList
                    groups={myGroups}
                    myGroups={myGroups}
                    isLoading={loading}
                    onSelect={selectGroup}
                    onJoin={joinGroup}
                    onLeave={leaveGroup}
                    groupMembers={groupMembers}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      <div className="pb-16 md:pb-0"></div>
      <BottomNavigation />
    </div>
  );
};

export default Collaboration;
