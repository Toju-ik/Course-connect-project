
import React, { useState } from 'react';
import { useGamification } from '../../hooks/useGamification';
import { useFlashcards } from '../../hooks/useFlashcards';
import { Module } from '../../types/module';
import FlashcardForm from './FlashcardForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface FlashcardsListProps {
  modules: Module[];
}

export const FlashcardsList: React.FC<FlashcardsListProps> = ({ modules }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<any>(null);
  const [deleteFlashcardId, setDeleteFlashcardId] = useState<string | null>(null);
  const { awardFlashcardCreationCoins, updateCoinBalance } = useGamification();
  
  const { 
    flashcards, 
    activeModule,
    setActiveModule,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refreshFlashcards,
    logCurrentState
  } = useFlashcards();

  const handleCreateFlashcard = async (question: string, answer: string, moduleId: string | null) => {
    console.log('Creating flashcard with data:', { question, answer, moduleId });
    const result = await createFlashcard(question, answer, moduleId);
    
    if (result) {
      // Award coins for flashcard creation
      awardFlashcardCreationCoins()
        .then(success => {
          if (success) {
            toast.success("You earned 2 coins for creating a flashcard!");
            // Ensure the UI is updated with the new balance
            updateCoinBalance().then(() => {
              console.log('[FlashcardsList] Coin balance updated in UI after flashcard creation');
            });
          }
        });
      
      setShowAddForm(false);
      refreshFlashcards();
      return true;
    }
    return false;
  };
  
  const handleUpdateFlashcard = async (question: string, answer: string, moduleId: string | null) => {
    console.log('Updating flashcard with data:', { question, answer, moduleId });
    if (!editingFlashcard) return false;
    
    const result = await updateFlashcard(
      editingFlashcard.id, 
      question, 
      answer, 
      moduleId
    );
    
    if (result) {
      setEditingFlashcard(null);
      refreshFlashcards();
      return true;
    }
    return false;
  };
  
  const confirmDeleteFlashcard = async () => {
    if (deleteFlashcardId) {
      const success = await deleteFlashcard(deleteFlashcardId);
      if (success) {
        refreshFlashcards();
      }
      setDeleteFlashcardId(null);
    }
  };
  
  const getModuleName = (moduleId: string | null) => {
    if (!moduleId) return 'General';
    const module = modules.find(m => m.id === moduleId);
    return module ? `${module.code}: ${module.name}` : 'Unknown Module';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flashcards</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Flashcard
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <select
          className="px-4 py-2 border rounded-md"
          value={activeModule || ''}
          onChange={(e) => setActiveModule(e.target.value || null)}
        >
          <option value="">All Modules</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.code}: {module.name}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={refreshFlashcards}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="secondary" size="sm" onClick={logCurrentState}>
          Debug
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="mb-6 border-primary/20 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create New Flashcard</CardTitle>
            <CardDescription>Add a new flashcard to your collection</CardDescription>
          </CardHeader>
          <CardContent>
            <FlashcardForm 
              onSubmit={handleCreateFlashcard}
              onCancel={() => setShowAddForm(false)}
              selectedModuleId={activeModule}
            />
          </CardContent>
        </Card>
      )}
      
      {editingFlashcard && (
        <Card className="mb-6 border-primary/20 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Edit Flashcard</CardTitle>
            <CardDescription>Update your flashcard</CardDescription>
          </CardHeader>
          <CardContent>
            <FlashcardForm 
              initialData={editingFlashcard}
              onSubmit={handleUpdateFlashcard}
              onCancel={() => setEditingFlashcard(null)}
              selectedModuleId={editingFlashcard.module_id}
            />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <motion.div
            key={flashcard.id}
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle>{flashcard.question}</CardTitle>
                <CardDescription>
                  Module: {getModuleName(flashcard.module_id)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {flashcard.answer}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditingFlashcard(flashcard)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteFlashcardId(flashcard.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <AlertDialog open={!!deleteFlashcardId} onOpenChange={() => setDeleteFlashcardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this flashcard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFlashcard} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FlashcardsList;
