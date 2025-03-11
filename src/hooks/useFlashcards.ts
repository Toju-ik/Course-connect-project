
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  module_id?: string | null;
  user_id: string;
  created_at?: string;
}

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch flashcards and modules
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error('No active session');
          setIsLoading(false);
          return;
        }
        
        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('id, module_code, module_title');
          
        if (modulesError) throw modulesError;
        setModules(modulesData || []);
        
        // Fetch flashcards
        const { data: flashcardsData, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (flashcardsError) throw flashcardsError;
        setFlashcards(flashcardsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load flashcards. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Create flashcard
  const createFlashcard = async (question: string, answer: string, moduleId: string | null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      const newFlashcard = {
        question,
        answer,
        module_id: moduleId,
        user_id: session.user.id,
      };
      
      const { data, error } = await supabase
        .from('flashcards')
        .insert([newFlashcard])
        .select();
        
      if (error) throw error;
      
      if (data) {
        setFlashcards(prev => [...prev, data[0]]);
        toast({
          title: "Success",
          description: "Flashcard created successfully!",
        });
        return data[0];
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to create flashcard. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Update flashcard
  const updateFlashcard = async (id: string, question: string, answer: string, moduleId: string | null) => {
    try {
      const updates = {
        question,
        answer,
        module_id: moduleId,
      };
      
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      if (data) {
        setFlashcards(prev => 
          prev.map(fc => fc.id === id ? { ...fc, ...updates } : fc)
        );
        toast({
          title: "Success",
          description: "Flashcard updated successfully!",
        });
        return data[0];
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to update flashcard. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Delete flashcard
  const deleteFlashcard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setFlashcards(prev => prev.filter(fc => fc.id !== id));
      toast({
        title: "Success",
        description: "Flashcard deleted successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to delete flashcard. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Filter flashcards by module
  const filteredFlashcards = activeModule
    ? flashcards.filter(fc => fc.module_id === activeModule)
    : flashcards;
    
  return {
    flashcards: filteredFlashcards,
    modules,
    isLoading,
    activeModule,
    setActiveModule,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  };
};
