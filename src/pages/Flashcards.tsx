
import React, { useState, useEffect } from 'react';
import MobileLayout from '../components/layouts/MobileLayout';
import { useFlashcards } from '../hooks/useFlashcards';
import { useUserModules } from '../hooks/useUserModules';
import FlashcardsList from '../components/flashcards/FlashcardsList';
import FlashcardForm from '../components/flashcards/FlashcardForm';
import FlashcardStudy from '../components/flashcards/FlashcardStudy';
import ModuleFilter from '../components/flashcards/ModuleFilter';
import { BookOpen, Plus, List, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  module_id?: string | null;
  user_id: string;
}

const Flashcards: React.FC = () => {
  const { user } = useAuth();
  const { 
    flashcards, 
    isLoading, 
    activeModule, 
    setActiveModule,
    createFlashcard, 
    updateFlashcard, 
    deleteFlashcard,
    refreshFlashcards,
    logCurrentState
  } = useFlashcards();
  
  const { userModules } = useUserModules();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'study'>('list');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Temp for debugging: Log flashcard state when component mounts
  useEffect(() => {
    console.log("Flashcards component mounted");
    const count = logCurrentState();
    console.log(`Current flashcard count: ${count}`);
  }, [logCurrentState]);
  
  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setShowCreateForm(true);
  };
  
  const handleFormSubmit = async (question: string, answer: string, moduleId: string | null) => {
    try {
      console.log('Form submitted:', { question, answer, moduleId });
      
      if (!user) {
        toast.error('You must be logged in to create flashcards');
        return;
      }
      
      let result;
      if (editingFlashcard) {
        console.log('Updating existing flashcard');
        result = await updateFlashcard(editingFlashcard.id, question, answer, moduleId);
        if (result) {
          setEditingFlashcard(null);
        }
      } else {
        console.log('Creating new flashcard');
        result = await createFlashcard(question, answer, moduleId);
      }
      
      if (result) {
        setShowCreateForm(false);
        toast.success(editingFlashcard ? 'Flashcard updated successfully!' : 'Flashcard created successfully!');
        
        // Manually refresh the flashcards list
        console.log('Manually refreshing flashcards after form submission');
        await refreshFlashcards();
        const count = logCurrentState();
        console.log(`Updated flashcard count after operation: ${count}`);
      }
    } catch (error: any) {
      console.error('Error handling form submission:', error);
      toast.error(`An error occurred: ${error.message}`);
    }
  };
  
  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingFlashcard(null);
  };
  
  const handleToggleView = () => {
    setCurrentView(currentView === 'list' ? 'study' : 'list');
  };
  
  const handleManualRefresh = async () => {
    console.log('Manual refresh triggered by user');
    toast.info('Refreshing flashcards...');
    await refreshFlashcards();
    toast.success('Flashcards refreshed!');
    const count = logCurrentState();
    console.log(`Flashcard count after manual refresh: ${count}`);
  };
  
  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };
  
  return (
    <MobileLayout title="Flashcards">
      <div className="py-4">
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleToggleView}
                className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center"
              >
                {currentView === 'list' ? (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Study Mode
                  </>
                ) : (
                  <>
                    <List className="w-4 h-4 mr-2" />
                    List View
                  </>
                )}
              </button>
              
              {currentView === 'list' && !showCreateForm && (
                <>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Flashcard
                  </button>
                  
                  <button
                    onClick={handleManualRefresh}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Flashcards
                  </button>
                  
                  <button
                    onClick={toggleDebugInfo}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-sm"
                  >
                    {showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading flashcards...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {showCreateForm ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {editingFlashcard ? 'Edit Flashcard' : 'Create New Flashcard'}
                  </h2>
                  <FlashcardForm
                    initialData={editingFlashcard || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                    selectedModuleId={activeModule}
                  />
                </div>
              ) : currentView === 'list' ? (
                <>
                  <ModuleFilter
                    modules={userModules}
                    activeModule={activeModule}
                    onModuleChange={setActiveModule}
                  />
                  
                  {showDebugInfo && (
                    <div className="bg-gray-100 p-4 rounded-lg mb-4 text-xs overflow-auto">
                      <h3 className="font-bold mb-2">Debug Information</h3>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify({
                          totalFlashcards: flashcards.length,
                          activeModule,
                          isLoading,
                          flashcardData: flashcards
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  <FlashcardsList modules={userModules} />
                </>
              ) : (
                <FlashcardStudy flashcards={flashcards} />
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Flashcards;
