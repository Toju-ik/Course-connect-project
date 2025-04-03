
import { Friend } from '@/types/friends';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, X } from 'lucide-react';

// Type guard to check if an object is a valid friend record
function isValidFriend(friend: Friend['friend']): friend is Exclude<Friend['friend'], { error: true }> {
  return friend && !('error' in friend);
}

interface FriendsListProps {
  friends: Friend[];
  isLoading: boolean;
  onRemoveFriend: (friendId: string) => Promise<boolean>;
}

const FriendsList = ({
  friends,
  isLoading,
  onRemoveFriend
}: FriendsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <p>Loading friends...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <User size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No friends yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          Find and add friends to start collaborating
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {friends.map((friendship) => {
        // Narrow the friend data using our type guard
        const friendData = friendship.friend;
        if (!friendData || !isValidFriend(friendData)) {
          console.error('Invalid friend data for friendship:', friendship);
          return null;
        }
        
        return (
          <Card key={friendship.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    {friendData.avatar_url ? (
                      <AvatarImage src={friendData.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        {friendData.full_name
                          ? friendData.full_name.substring(0, 2).toUpperCase()
                          : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {friendData.full_name || 'User'}
                    </p>
                    {friendData.username && (
                      <p className="text-xs text-gray-500">@{friendData.username}</p>
                    )}
                    {friendData.student_id && (
                      <p className="text-xs text-gray-500">#{friendData.student_id}</p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onRemoveFriend(friendship.friend_id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FriendsList;
