
import { supabase } from '../../lib/supabase';
import { CoinSource } from '../../types/gamification';
import { getApiUrl } from '../../components/api/routes';

// Milestone thresholds for notifications
export const COIN_MILESTONES = [30, 60, 100, 150, 200, 300, 500, 750, 1000];

// Function to check if a balance crosses a milestone
export const checkMilestoneReached = (previousBalance: number, newBalance: number): number | null => {
  // Find the first milestone that was crossed with this update
  for (const milestone of COIN_MILESTONES) {
    if (previousBalance < milestone && newBalance >= milestone) {
      return milestone;
    }
  }
  return null;
};

// Function to send milestone SMS notification
export const sendMilestoneSmsNotification = async (
  userId: string, 
  phoneNumber: string | null | undefined, 
  milestone: number
): Promise<boolean> => {
  if (!phoneNumber) {
    console.log('[Gamification] No phone number available for SMS notification');
    return false;
  }
  
  try {
    console.log(`[Gamification] Sending milestone SMS notification for ${milestone} coins`);
    
    const message = `Congratulations! 🎉 You've reached ${milestone} coins in your studypal account! Keep up the great work!`;
    
    const response = await fetch(getApiUrl('/api/send-sms-notification'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phoneNumber,
        message
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Gamification] Error sending SMS notification:', errorData);
      return false;
    }
    
    console.log('[Gamification] SMS notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Gamification] Error in sendMilestoneSmsNotification:', error);
    return false;
  }
};

// Record milestone achievement to prevent duplicate notifications
export const recordMilestoneAchievement = async (
  userId: string,
  milestone: number
): Promise<boolean> => {
  try {
    console.log(`[Gamification] Recording milestone achievement: ${milestone} coins`);
    
    // Use the coin_transactions table with a special 'milestone' source to record this
    const { error } = await supabase
      .from('coin_transactions')
      .insert([{
        user_id: userId,
        amount: 0, // No coins awarded for milestone, just tracking
        source: 'milestone',
        description: `Reached ${milestone} coins milestone`
      }]);
      
    if (error) {
      console.error('[Gamification] Error recording milestone achievement:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('[Gamification] Error in recordMilestoneAchievement:', error);
    return false;
  }
};

// Check if a milestone has already been achieved
export const hasMilestoneBeenAchieved = async (
  userId: string,
  milestone: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('coin_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('source', 'milestone')
      .eq('description', `Reached ${milestone} coins milestone`)
      .limit(1);
      
    if (error) {
      console.error('[Gamification] Error checking milestone achievement:', error);
      throw error;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('[Gamification] Error in hasMilestoneBeenAchieved:', error);
    return false; // Assume not achieved in case of error
  }
};

// Centralized function to get user's current coin balance
export const fetchUserCoins = async (userId: string): Promise<number> => {
  try {
    console.log('[Gamification] Fetching coins for user:', userId);
    
    const { data, error } = await supabase
      .from('user_coins')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('[Gamification] Error fetching user coins:', error);
      if (error.code === 'PGRST116') {
        console.log('[Gamification] No coins record found');
        return 0;
      }
      throw error;
    }
    
    return data.balance;
  } catch (error) {
    console.error('[Gamification] Error in fetchUserCoins:', error);
    return 0;
  }
};

// Create initial coins record for a new user
export const createInitialCoinsRecord = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    console.log('[Gamification] Creating/updating coins record for user:', userId);
    
    const initialBalance = 0;
    const upsertPayload = {
      user_id: userId,
      balance: initialBalance,
      last_updated: new Date().toISOString()
    };
    
    console.log('[Gamification] Upsert payload:', upsertPayload);
    
    const { data, error } = await supabase
      .from('user_coins')
      .upsert([upsertPayload], { onConflict: 'user_id' })
      .select()
      .single();
      
    if (error) {
      console.error('[Gamification] Error upserting user coins record:', error);
      console.error('[Gamification] Error details:', error.details);
      return false;
    }
    
    console.log('[Gamification] Created/updated coins record:', data);
    return true;
  } catch (error) {
    console.error('[Gamification] Error in createInitialCoinsRecord:', error);
    return false;
  }
};

// Record a coin transaction and update the user's balance
export const recordCoinTransaction = async (
  userId: string, 
  amount: number, 
  source: CoinSource, 
  description: string,
  currentBalance: number
): Promise<{success: boolean, newBalance?: number, transaction?: any, milestone?: number}> => {
  try {
    console.log(`[Gamification] Recording transaction of ${amount} coins for: ${description}`);
    console.log(`[Gamification] Current balance before transaction: ${currentBalance}`);
    
    // Calculate the new balance
    const newBalance = currentBalance + amount;
    console.log(`[Gamification] New balance will be: ${newBalance}`);
    
    // Record the transaction
    const transactionPayload = {
      user_id: userId,
      amount,
      source,
      description
    };
    
    const { data: transactionData, error: transactionError } = await supabase
      .from('coin_transactions')
      .insert([transactionPayload])
      .select();
      
    if (transactionError) {
      console.error('[Gamification] Error recording transaction:', transactionError);
      return { success: false };
    }
    
    console.log('[Gamification] Transaction recorded successfully:', transactionData);
    
    // Update the user's coin balance
    const { data: updateData, error: updateError } = await supabase
      .from('user_coins')
      .update({ 
        balance: newBalance,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('balance');
    
    if (updateError) {
      console.error('[Gamification] Error updating coin balance:', updateError);
      return { success: false };
    }
    
    console.log('[Gamification] Balance updated successfully:', updateData);
    
    // Check if a milestone was reached with this transaction
    const milestone = checkMilestoneReached(currentBalance, newBalance);
    
    if (updateData && updateData.length > 0) {
      return { 
        success: true, 
        newBalance: updateData[0].balance,
        transaction: transactionData[0],
        milestone
      };
    }
    
    return { 
      success: true, 
      transaction: transactionData[0],
      milestone
    };
  } catch (error) {
    console.error('[Gamification] Error in recordCoinTransaction:', error);
    return { success: false };
  }
};
