
export type Friend = {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  friend: {
    id: string;
    student_id: string | null;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | { error: true; message?: string }; // Add error handling
};

export type FriendRequest = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    student_id: string | null;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | { error: true; message?: string }; // Add error handling
  receiver?: {
    id: string;
    student_id: string | null;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | { error: true; message?: string }; // Add error handling
};

export type UserSearchResult = {
  id: string;
  student_id: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  relationshipStatus?: 'friend' | 'outgoing_request' | 'incoming_request' | null;
};
