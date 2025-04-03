
import { User } from '@supabase/supabase-js';

export interface StudyGroup {
  id: string;
  study_group_name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

export interface GroupMembership {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  student_id: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}
