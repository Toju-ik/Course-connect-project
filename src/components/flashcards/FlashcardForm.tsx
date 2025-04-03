
import React, { useState, useEffect } from 'react';
import { useUserModules } from '../../hooks/useUserModules';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Module } from '../../types/module';

interface FlashcardFormProps {
  initialData?: {
    id?: string;
    question: string;
    answer: string;
    module_id?: string | null;
  };
  onSubmit: (question: string, answer: string, moduleId: string | null) => void;
  onCancel: () => void;
  selectedModuleId?: string | null;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  selectedModuleId
}) => {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [moduleId, setModuleId] = useState<string | null>(initialData?.module_id || selectedModuleId || null);
  const { userModules, isLoading } = useUserModules();
  const { user } = useAuth();
  
  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setAnswer(initialData.answer);
      setModuleId(initialData.module_id || null);
    } else if (selectedModuleId) {
      setModuleId(selectedModuleId);
    }
  }, [initialData, selectedModuleId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Question is required');
      return;
    }
    
    if (!answer.trim()) {
      toast.error('Answer is required');
      return;
    }
    
    console.log('Submitting flashcard:', { question, answer, moduleId });
    onSubmit(question, answer, moduleId);
  };
  
  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">You must be logged in to create flashcards</p>
      </div>
    );
  }
  
  const selectedModule = userModules.find(module => module.id === selectedModuleId);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
          placeholder="Enter your question"
          required
        />
      </div>
      
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
          Answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md min-h-[120px]"
          placeholder="Enter the answer"
          required
        />
      </div>
      
      {selectedModuleId ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module
          </label>
          <div className="p-2 border border-gray-200 bg-gray-50 rounded-md">
            {selectedModule ? `${selectedModule.code}: ${selectedModule.name}` : 'No Module'}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Using the module selected in the filter
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
            Module (Optional)
          </label>
          <select
            id="module"
            value={moduleId || ''}
            onChange={(e) => setModuleId(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="">No Module</option>
            {userModules.map((module: Module) => (
              <option key={module.id} value={module.id}>
                {module.code}: {module.name}
              </option>
            ))}
          </select>
          {isLoading && (
            <p className="text-xs text-gray-500 mt-1">Loading modules...</p>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
        >
          {initialData?.id ? 'Update' : 'Create'} Flashcard
        </button>
      </div>
    </form>
  );
};

export default FlashcardForm;
