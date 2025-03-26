import { supabase } from '@/lib/supabase';

export const addStudySession = async (
  userId: string,
  durationSec: number,
  coins: number
) => {
  const duration = Math.round(durationSec / 60);
  const date = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('study_sessions')
    .insert([{
      user_id: userId,
      duration, // ✅ match field name
      date,     // ✅ match field name
      module_id: null,
      notes: `Auto-logged from Focus Timer (+${coins} coins)`
    }])
    .select();

  if (error) {
    console.error('Insert failed:', error);
    return null;
  }

  return data?.[0] || null;
};
