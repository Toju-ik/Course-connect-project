import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  module_id?: string | null;
  user_id: string;
  created_at?: string;
}

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch flashcards with enhanced logging
  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (!user) {
        console.error('No active session');
        toast.error('You must be logged in to view flashcards');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching flashcards for user:', user.id);
      console.log('Current active module filter:', activeModule || 'None (showing all)');
      
      const { data: flashcardsData, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id);
        
      if (flashcardsError) {
        console.error('Error fetching flashcards:', flashcardsError);
        throw flashcardsError;
      }
      
      console.log('Raw API response:', flashcardsData);
      console.log('Number of flashcards returned from API:', flashcardsData?.length || 0);
      
      if (!flashcardsData || flashcardsData.length === 0) {
        console.warn('No flashcards found for this user');
      }
      
      setFlashcards(flashcardsData || []);
      console.log('State updated with flashcards:', flashcardsData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load flashcards: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, activeModule, toast]);
  
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching flashcards');
      fetchFlashcards();
    } else {
      console.log('No user authenticated, skipping flashcard fetch');
    }
  }, [user, fetchFlashcards]);
  
  // Create flashcard with enhanced logging
  const createFlashcard = async (question: string, answer: string, moduleId: string | null) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create flashcards');
      }
      
      console.log('Creating flashcard with data:', { question, answer, moduleId });
      
      const newFlashcard = {
        question,
        answer,
        module_id: moduleId,
        user_id: user.id
      };
      
      console.log('Inserting flashcard:', newFlashcard);
      const { data, error } = await supabase
        .from('flashcards')
        .insert([newFlashcard])
        .select();
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Insertion response:', data);
      
      if (data && data.length > 0) {
        console.log('Flashcard created successfully:', data[0]);
        
        // Update local flashcards state to include the new one
        setFlashcards(prev => {
          const newState = [...prev, data[0]];
          console.log('Updated flashcards state after creation:', newState);
          return newState;
        });
        
        toast.success('Flashcard created successfully!');
        
        // Explicitly refresh the flashcards list
        console.log('Refreshing flashcards after creation');
        fetchFlashcards();
        
        return data[0];
      } else {
        throw new Error('No data returned from insert operation');
      }
    } catch (error: any) {
      console.error('Error creating flashcard:', error);
      toast.error(`Failed to create flashcard: ${error.message}`);
      return null;
    }
  };
  
  // Update flashcard
  const updateFlashcard = async (id: string, question: string, answer: string, moduleId: string | null) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update flashcards');
      }
      
      console.log('Updating flashcard:', { id, question, answer, moduleId });
      
      const updates = {
        question,
        answer,
        module_id: moduleId,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      console.log('Update response:', data);
      
      if (data && data.length > 0) {
        // Update the local state with the updated flashcard
        setFlashcards(prev => {
          const newState = prev.map(fc => fc.id === id ? data[0] : fc);
          console.log('Updated flashcards state after update:', newState);
          return newState;
        });
        
        toast.success('Flashcard updated successfully!');
        
        // Explicitly refresh the flashcards list
        console.log('Refreshing flashcards after update');
        fetchFlashcards();
        
        return data[0];
      } else {
        throw new Error('Failed to update flashcard');
      }
    } catch (error: any) {
      console.error('Error updating flashcard:', error);
      toast.error(`Failed to update flashcard: ${error.message}`);
      return null;
    }
  };
  
  // Delete flashcard
  const deleteFlashcard = async (id: string) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to delete flashcards');
      }
      
      console.log('Deleting flashcard with ID:', id);
      
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Remove the deleted flashcard from local state
      setFlashcards(prev => {
        const newState = prev.filter(fc => fc.id !== id);
        console.log('Updated flashcards state after deletion:', newState);
        return newState;
      });
      
      toast.success('Flashcard deleted successfully!');
      
      // Explicitly refresh the flashcards list
      console.log('Refreshing flashcards after deletion');
      fetchFlashcards();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting flashcard:', error);
      toast.error(`Failed to delete flashcard: ${error.message}`);
      return false;
    }
  };
  
  // Filter flashcards by module
  const filteredFlashcards = activeModule
    ? flashcards.filter(fc => fc.module_id === activeModule)
    : flashcards;
    
  // Add a debug function to log current state
  const logCurrentState = () => {
    console.log({
      totalFlashcards: flashcards.length,
      filteredFlashcards: filteredFlashcards.length,
      activeModule,
      isLoading,
      userAuthenticated: !!user
    });
    return filteredFlashcards.length;
  };
    
  return {
    flashcards: filteredFlashcards,
    isLoading,
    activeModule,
    setActiveModule,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refreshFlashcards: fetchFlashcards,
    logCurrentState
  };
};
