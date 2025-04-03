
// Gamification related types

export type CoinSource = 
  | 'focus_timer' 
  | 'task_completion' 
  | 'flashcard_creation' 
  | 'streak_bonus' 
  | 'registration_bonus'
  | 'milestone'
  | 'other';

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  source: CoinSource;
  description: string;
  created_at: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}
