
import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  module_id?: string | null;
  user_id: string;
}

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

interface FlashcardsListProps {
  flashcards: Flashcard[];
  modules: Module[];
  onEdit: (flashcard: Flashcard) => void;
  onDelete: (id: string) => void;
}

const FlashcardsList: React.FC<FlashcardsListProps> = ({ 
  flashcards, 
  modules, 
  onEdit, 
  onDelete 
}) => {
  const getModuleName = (moduleId: string | null | undefined) => {
    if (!moduleId) return 'Uncategorized';
    const module = modules.find(m => m.id === moduleId);
    return module ? `${module.module_code}: ${module.module_title}` : 'Unknown Module';
  };
  
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No flashcards found. Create one to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {flashcards.map(flashcard => (
        <div key={flashcard.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{flashcard.question}</h3>
              <p className="mt-2 text-gray-600">{flashcard.answer}</p>
              <p className="mt-2 text-xs text-gray-400">{getModuleName(flashcard.module_id)}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEdit(flashcard)}
                className="p-1 text-gray-500 hover:text-primary transition-colors"
                aria-label="Edit flashcard"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(flashcard.id)}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Delete flashcard"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashcardsList;
