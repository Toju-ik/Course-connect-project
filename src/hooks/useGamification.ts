
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';
import { useAuth } from '../contexts/AuthContext';
import { CoinTransaction, CoinSource } from '../types/gamification';
import { 
  fetchUserCoins, 
  createInitialCoinsRecord, 
  recordCoinTransaction,
  sendMilestoneSmsNotification,
  hasMilestoneBeenAchieved,
  recordMilestoneAchievement
} from '../utils/gamification/coinUtils';
import { 
  fetchUserStreak, 
  recordDailyActivity, 
  checkStreakBonusEligibility 
} from '../utils/gamification/streakUtils';
import { setupCoinsRealtimeSubscription } from '../utils/gamification/realtimeUtils';

export const useGamification = () => {
  const [coins, setCoins] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const supabaseSubscription = useRef<any>(null);

 
  const updateCoinBalance = useCallback(async () => {
    if (!user) return;
    
    try {
      const newBalance = await fetchUserCoins(user.id);
      console.log('[Gamification] Updated coin balance from database:', newBalance);
      setCoins(newBalance);
    } catch (error) {
      console.error('[Gamification] Error in updateCoinBalance:', error);
    }
  }, [user]);

  
  const setupRealtimeSubscription = useCallback(() => {
    if (!user) return;
    
    try {
      if (supabaseSubscription.current) {
        supabase.removeChannel(supabaseSubscription.current);
      }
      
    
      supabaseSubscription.current = setupCoinsRealtimeSubscription(
        user.id, 
        (newBalance) => setCoins(newBalance)
      );
      
      return () => {
        if (supabaseSubscription.current) {
          console.log('[Gamification] Removing real-time subscription');
          supabase.removeChannel(supabaseSubscription.current);
        }
      };
    } catch (error) {
      console.error('[Gamification] Error setting up real-time subscription:', error);
    }
  }, [user]);

  
  const fetchCoins = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      
      const coinsBalance = await fetchUserCoins(user.id);
      console.log('[Gamification] Fetched initial coin balance:', coinsBalance);
      
      if (coinsBalance === 0) {
        
        await createInitialCoinsRecord(user.id);
      } else {
        setCoins(coinsBalance);
      }
      
     
      const userStreak = await fetchUserStreak(user.id);
      setStreak(userStreak);
      
     
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (transactionsError) {
        console.error('[Gamification] Error fetching transactions:', transactionsError);
      } else if (transactionsData) {
        setTransactions(transactionsData as CoinTransaction[]);
      }
    } catch (error) {
      console.error('[Gamification] Error in fetchCoins:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
 
  useEffect(() => {
    if (user) {
      fetchCoins();
      setupRealtimeSubscription();
    }
    
    return () => {
      if (supabaseSubscription.current) {
        supabase.removeChannel(supabaseSubscription.current);
      }
    };
  }, [user, fetchCoins, setupRealtimeSubscription]);

 
  const handleMilestoneAchievement = useCallback(async (milestone: number) => {
    if (!user) return;
    
    try {
     
      const alreadyAchieved = await hasMilestoneBeenAchieved(user.id, milestone);
      
      if (alreadyAchieved) {
        console.log(`[Gamification] Milestone ${milestone} already achieved, skipping notification`);
        return;
      }
      
      
      await recordMilestoneAchievement(user.id, milestone);
      
      
      toast({
        title: "Achievement Unlocked! 🏆",
        description: `Congratulations! You've reached ${milestone} coins!`,
        variant: "default",
      });
      
     
      const { data: profileData } = await supabase
        .from('profiles')
        .select('phone_number, sms_notifications')
        .eq('id', user.id)
        .single();
        
    
      if (profileData?.sms_notifications && profileData?.phone_number) {
        await sendMilestoneSmsNotification(user.id, profileData.phone_number, milestone);
      } else {
        console.log('[Gamification] SMS notifications disabled or no phone number available');
      }
      
    } catch (error) {
      console.error('[Gamification] Error handling milestone achievement:', error);
    }
  }, [user, toast]);

 
  const awardCoins = async (amount: number, source: CoinSource, description: string) => {
    if (!user) {
      console.error('[Gamification] Cannot award coins: User not logged in');
      return false;
    }
    
    try {
     
      const currentBalance = await fetchUserCoins(user.id);
      console.log('[Gamification] Current balance before awarding:', currentBalance);
      
      
      const result = await recordCoinTransaction(user.id, amount, source, description, currentBalance);
      
      if (result.success) {
       
        if (result.newBalance !== undefined) {
          console.log('[Gamification] Setting new balance to:', result.newBalance);
          setCoins(result.newBalance);
        } else {
         
          await updateCoinBalance();
        }
        
        
        if (result.transaction) {
          setTransactions(prevTransactions => [
            result.transaction as CoinTransaction,
            ...prevTransactions
          ]);
        }
        
        
        if (result.milestone) {
          await handleMilestoneAchievement(result.milestone);
        }
        
        toast({
          title: "Coins Awarded",
          description: `You earned ${amount} coins: ${description}`,
          variant: "default",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[Gamification] Error in awardCoins:', error);
      return false;
    }
  };
  
  
  const checkAndAwardStreakBonus = async () => {
    const bonusInfo = checkStreakBonusEligibility(streak);
    if (bonusInfo.eligible) {
      return awardCoins(bonusInfo.amount, 'streak_bonus', bonusInfo.description);
    }
    return false;
  };
  
 
  const awardFocusSessionCoins = async (minutes: number) => {
    console.log(`[Gamification] Awarding coins for ${minutes}-minute focus session`);
    const amount = minutes;
    const description = `Completed a ${minutes}-minute focus session`;
    
    await recordDailyActivity(user?.id || '');
    const success = await awardCoins(amount, 'focus_timer', description);
    
    
    const newStreak = await fetchUserStreak(user?.id || '');
    setStreak(newStreak);
    
    
    if (newStreak > streak) {
      await checkAndAwardStreakBonus();
    }
    
    return success;
  };
  
 
  const awardTaskCompletionCoins = async () => {
    console.log('[Gamification] Awarding coins for task completion');
    const amount = 5;
    const description = 'Completed a task';
    
    await recordDailyActivity(user?.id || '');
    const success = await awardCoins(amount, 'task_completion', description);
    
   
    const newStreak = await fetchUserStreak(user?.id || '');
    setStreak(newStreak);
    
    return success;
  };
  
  
  const awardFlashcardCreationCoins = async () => {
    console.log('[Gamification] Awarding coins for flashcard creation');
    const amount = 2;
    const description = 'Created a flashcard';
    
    await recordDailyActivity(user?.id || '');
    const success = await awardCoins(amount, 'flashcard_creation', description);
    
    return success;
  };
  
  return {
    coins,
    streak,
    transactions,
    loading,
    awardCoins,
    awardFocusSessionCoins,
    awardTaskCompletionCoins,
    awardFlashcardCreationCoins,
    checkAndAwardStreakBonus,
    recordDailyActivity: async () => recordDailyActivity(user?.id || ''),
    refreshCoins: fetchCoins,
    updateCoinBalance
  };
};
