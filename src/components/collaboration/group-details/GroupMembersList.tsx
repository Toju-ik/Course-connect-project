
import { User, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GroupMember, StudyGroup } from '@/types/studyGroups';
import { Friend } from '@/types/friends';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';

interface GroupMembersListProps {
  group: StudyGroup;
  members: GroupMember[];
  isCreator: boolean;
  friends: Friend[];
  loadingFriends: boolean;
  onAddMember?: (userId: string) => Promise<boolean>;
}

export const GroupMembersList = ({
  group,
  members,
  isCreator,
  friends,
  loadingFriends,
  onAddMember
}: GroupMembersListProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  const getAvailableFriends = () => {
    const memberIds = members.map(member => member.id);
    
    return friends.filter(friendship => {
      if ('error' in friendship.friend) return false;
      return !memberIds.includes(friendship.friend_id);
    });
  };

  const handleAddMember = async (userId: string) => {
    if (!onAddMember) return;

    try {
      setAddingMember(true);
      await onAddMember(userId);
      setDropdownOpen(false);
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <>
      {isCreator && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Add Members</CardTitle>
            <CardDescription>
              Add your friends to this group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAvailableFriends().length > 0 ? (
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      disabled={loadingFriends || addingMember}
                    >
                      <span>Select a friend to add</span>
                      <UserPlus className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white">
                    {getAvailableFriends().map((friendship) => {
                      if ('error' in friendship.friend) return null;
                      
                      return (
                        <DropdownMenuItem 
                          key={friendship.friend_id}
                          className="flex items-center p-2 cursor-pointer"
                          onClick={() => handleAddMember(friendship.friend_id)}
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            {friendship.friend.avatar_url ? (
                              <AvatarImage src={friendship.friend.avatar_url} />
                            ) : (
                              <AvatarFallback>
                                <User className="h-3 w-3" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span>
                            {friendship.friend.full_name || 'User'}
                            {friendship.friend.username && (
                              <span className="text-xs text-gray-500 ml-1">
                                @{friendship.friend.username}
                              </span>
                            )}
                            {friendship.friend.student_id && (
                              <span className="text-xs text-gray-500 ml-1">
                                #{friendship.friend.student_id}
                              </span>
                            )}
                          </span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : loadingFriends ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">Loading your friends...</p>
                </div>
              ) : (
                <div className="text-center py-4 border rounded-md bg-gray-50">
                  <p className="text-sm text-gray-500">
                    {friends.length > 0 
                      ? "All your friends are already members"
                      : "You don't have any friends yet"}
                  </p>
                  {friends.length === 0 && (
                    <Button
                      variant="link"
                      className="text-primary text-sm mt-1"
                      onClick={() => window.location.href = '/friends'}
                    >
                      Go to Friends page
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
          <CardDescription>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  {member.avatar_url ? (
                    <AvatarImage src={member.avatar_url} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.full_name || member.username || member.student_id || 'Anonymous'}
                    {member.id === group.created_by && (
                      <span className="ml-2 text-xs text-primary">(Creator)</span>
                    )}
                  </p>
                  {member.username && (
                    <p className="text-xs text-gray-500">@{member.username}</p>
                  )}
                  {member.student_id && (
                    <p className="text-xs text-gray-500">#{member.student_id}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
};
