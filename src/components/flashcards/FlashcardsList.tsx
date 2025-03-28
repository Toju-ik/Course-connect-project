import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";

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

const colorMap = [
  "bg-blue-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-orange-100",
];

const FlashcardsList: React.FC<FlashcardsListProps> = ({
  flashcards,
  modules,
  onEdit,
  onDelete,
}) => {
  const getModuleName = (moduleId: string | null | undefined) => {
    if (!moduleId) return "Uncategorized";
    const module = modules.find((m) => m.id === moduleId);
    return module
      ? `${module.module_code}: ${module.module_title}`
      : "Unknown Module";
  };

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No flashcards found. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {flashcards.map((flashcard, index) => {
        const [flipped, setFlipped] = useState(false);
        const bgColor = colorMap[index % colorMap.length];

        return (
          <div
            key={flashcard.id}
            className="perspective h-48 cursor-pointer"
            onClick={() => setFlipped(!flipped)}
          >
            <div className={`flip-container w-full h-full ${flipped ? "flipped" : ""}`}>
              {/* Front */}
              <div className={`flashcard-side flashcard-front ${bgColor} lined-paper`}>
                <h3 className="text-lg font-semibold text-gray-800">
                  {flashcard.question}
                </h3>
                <p className="mt-3 text-xs text-gray-700 italic">
                  {getModuleName(flashcard.module_id)}
                </p>
              </div>

              {/* Back */}
              <div className="flashcard-side flashcard-back bg-white lined-paper">
                <p className="text-gray-800 text-sm">{flashcard.answer}</p>
                <div className="flex justify-end items-center gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(flashcard);
                    }}
                    className="text-gray-500 hover:text-primary"
                    aria-label="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(flashcard.id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlashcardsList;
