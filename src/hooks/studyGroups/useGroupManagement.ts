
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useGroupManagement = (
  user: User | null,
  fetchStudyGroups: () => Promise<any>,
  fetchMyGroups: () => Promise<any>
) => {
  const { toast } = useToast();

  const createStudyGroup = async (groupName: string, description: string = '') => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'You must be logged in to create a study group.',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('study_groups')
        .insert({
          study_group_name: groupName,
          description: description || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const { error: membershipError } = await supabase
          .from('group_memberships')
          .insert({
            group_id: data.id,
            user_id: user.id,
          });

        if (membershipError) {
          console.error('Error adding creator as member:', membershipError);
          // Continue anyway as the group was created successfully
        }
      }

      toast({
        title: 'Success',
        description: 'Study group created successfully.',
      });
      
      await fetchStudyGroups();
      await fetchMyGroups();
      
      return data;
    } catch (error: any) {
      console.error('Error creating study group:', error.message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create study group.',
      });
      return null;
    }
  };

  return {
    createStudyGroup
  };
};
