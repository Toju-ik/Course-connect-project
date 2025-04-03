
import { FriendRequest } from '@/types/friends';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, User, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Define a union type for the friend data that may come from a friend request
type FriendData =
  | {
      id: string;
      student_id: string | null;
      full_name: string | null;
      username: string | null;
      avatar_url: string | null;
    }
  | { error: true; message?: string };

// Type guard to check if an object is a valid friend record
function isValidFriend(friend: FriendData): friend is Exclude<FriendData, { error: true }> {
  return friend && !('error' in friend);
}

interface FriendRequestsListProps {
  requests: FriendRequest[];
  isLoading: boolean;
  onAccept: (requestId: string) => Promise<boolean>;
  onReject: (requestId: string) => Promise<boolean>;
  onCancel: (requestId: string) => Promise<boolean>;
}

export const FriendRequestsList = ({
  requests,
  isLoading,
  onAccept,
  onReject,
  onCancel
}: FriendRequestsListProps) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <p>Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <User size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No friend requests</h3>
        <p className="text-sm text-gray-500 mt-2">
          When you receive friend requests, they will appear here
        </p>
      </div>
    );
  }

  // Filter out any requests where the friend data is invalid
  const validRequests = requests.filter(request => {
    const isIncoming = request.receiver_id === user?.id;
    const otherUser = isIncoming ? request.sender : request.receiver;
    return otherUser && isValidFriend(otherUser);
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      {validRequests.map((request) => {
        const isIncoming = request.receiver_id === user?.id;
        // Narrow the friend data using our type guard
        const otherUser = (isIncoming ? request.sender : request.receiver) as Exclude<FriendData, { error: true }>;

        return (
          <Card key={request.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    {otherUser.avatar_url ? (
                      <AvatarImage src={otherUser.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        {otherUser.full_name
                          ? otherUser.full_name.substring(0, 2).toUpperCase()
                          : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {otherUser.full_name || 'User'}
                    </p>
                    {otherUser.username && (
                      <p className="text-xs text-gray-500">@{otherUser.username}</p>
                    )}
                    {otherUser.student_id && (
                      <p className="text-xs text-gray-500">#{otherUser.student_id}</p>
                    )}
                  </div>
                </div>
                
                {isIncoming ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onAccept(request.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onReject(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => onCancel(request.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
