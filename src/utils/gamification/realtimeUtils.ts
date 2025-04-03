
import { supabase } from '../../lib/supabase';

// Setup realtime subscription for coin balance updates
export const setupCoinsRealtimeSubscription = (
  userId: string, 
  onUpdate: (balance: number) => void
) => {
  console.log('[Gamification] Setting up real-time subscription for user_coins');
  
  const channel = supabase
    .channel('public:user_coins')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'user_coins',
        filter: `user_id=eq.${userId}`
      }, 
      (payload) => {
        console.log('[Gamification] Real-time update received:', payload);
        if (payload.new && 'balance' in payload.new) {
          console.log('[Gamification] Updating coins from real-time event:', payload.new.balance);
          onUpdate(payload.new.balance);
        }
      }
    )
    .subscribe((status) => {
      console.log('[Gamification] Subscription status:', status);
    });
  
  return channel;
};
