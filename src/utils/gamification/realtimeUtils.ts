import { supabase } from '../../lib/supabase'; // Supabase client is initialized with the user’s auth session, so any channel actions use the authenticated client

// Setup realtime subscription for coin balance updates
export const setupCoinsRealtimeSubscription = (
  userId: string,                       // ← caller must supply the authenticated user’s ID (authentication should be verified before invoking this)
  onUpdate: (balance: number) => void   // ← callback to handle balance updates
) => {
  // At this point it is assume the authentication session has already been confirmed
  console.log('[Gamification] Setting up real-time subscription for user_coins');

  const channel = supabase
    .channel('public:user_coins')        // ← channel name; for stricter access control you could scope to `user:${userId}:coins`
    .on(
      'postgres_changes',                // ← listening to all Postgres change events…
      { 
        event: '*', 
        schema: 'public', 
        table: 'user_coins',
        filter: `user_id=eq.${userId}`   // ← database filter ensures only this user’s own coin‐balance updates are delivered
      }, 
      (payload) => {
        console.log('[Gamification] Real-time update received:', payload);
        if (payload.new && 'balance' in payload.new) {
          console.log('[Gamification] Updating coins from real-time event:', payload.new.balance);
          onUpdate(payload.new.balance); // ← invoke the update callback with the new balance
        }
      }
    )
    .subscribe((status) => {            // ← subscription is opened here, after authentication was (assumed) confirmed
      console.log('[Gamification] Subscription status:', status);
    });
  
  return channel;                       // ← return channel for later cleanup (unsubscribe)
};

