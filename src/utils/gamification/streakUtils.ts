
import { supabase } from '../../lib/supabase';

// Get the user's current streak
export const fetchUserStreak = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_streak', { p_user_id: userId });
      
    if (error) {
      console.error('[Gamification] Error fetching user streak:', error);
      return 0;
    }
    
    return data || 0;
  } catch (error) {
    console.error('[Gamification] Error fetching streak:', error);
    return 0;
  }
};

// Record daily activity for streak calculation
export const recordDailyActivity = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('[Gamification] Recording daily activity for:', today);
    
    const { data: existingActivity, error: checkError } = await supabase
      .from('user_daily_activity')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[Gamification] Error checking daily activity:', checkError);
      return false;
    }
    
    if (!existingActivity) {
      console.log('[Gamification] No activity recorded today, creating record');
      
      const activityPayload = {
        user_id: userId,
        date: today,
        has_activity: true
      };
      
      const { error: insertError } = await supabase
        .from('user_daily_activity')
        .insert([activityPayload]);
        
      if (insertError) {
        console.error('[Gamification] Error recording daily activity:', insertError);
        return false;
      }
      
      console.log('[Gamification] Activity recorded successfully');
      return true;
    } else {
      console.log('[Gamification] Activity already recorded for today');
      return true;
    }
  } catch (error) {
    console.error('[Gamification] Error in recordDailyActivity:', error);
    return false;
  }
};

// Check if user is eligible for a streak bonus
export const checkStreakBonusEligibility = (streak: number): { eligible: boolean, amount: number, description: string } => {
  if (streak === 3) {
    return { eligible: true, amount: 10, description: '3-day streak bonus' };
  } else if (streak === 5) {
    return { eligible: true, amount: 20, description: '5-day streak bonus' };
  } else if (streak > 0 && streak % 7 === 0) {
    return { eligible: true, amount: 30, description: `${streak}-day streak bonus` };
  }
  
  return { eligible: false, amount: 0, description: '' };
};
