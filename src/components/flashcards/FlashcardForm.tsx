
import React, { useState, useEffect } from 'react';

interface Module {
  id: string;
  module_code: string;
  module_title: string;
}

interface FlashcardFormProps {
  modules: Module[];
  initialData?: {
    id?: string;
    question: string;
    answer: string;
    module_id?: string | null;
  };
  onSubmit: (question: string, answer: string, moduleId: string | null) => void;
  onCancel: () => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({
  modules,
  initialData,
  onSubmit,
  onCancel
}) => {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [moduleId, setModuleId] = useState<string | null>(initialData?.module_id || null);
  
  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setAnswer(initialData.answer);
      setModuleId(initialData.module_id || null);
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(question, answer, moduleId);
  };
  
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
      
      <div>
        <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
          Module (Optional)
        </label>
        <select
          id="module"
          value={moduleId || ''}
          onChange={(e) => setModuleId(e.target.value || null)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">No Module</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.module_code}: {module.module_title}
            </option>
          ))}
        </select>
      </div>
      
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
