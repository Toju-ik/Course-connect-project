
import React, { useState, useEffect } from 'react';
import { ShuffleIcon, ArrowLeft, ArrowRight } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  module_id?: string | null;
  user_id: string;
}

interface FlashcardStudyProps {
  flashcards: Flashcard[];
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyDeck, setStudyDeck] = useState<Flashcard[]>([]);

  useEffect(() => {
    // Initialize study deck with the provided flashcards
    console.log('FlashcardStudy received flashcards:', flashcards);
    if (flashcards && flashcards.length > 0) {
      setStudyDeck([...flashcards]);
      setCurrentIndex(0);
      setShowAnswer(false);
    } else {
      // Set empty study deck if no flashcards provided
      setStudyDeck([]);
    }
  }, [flashcards]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">No flashcards available for study.</p>
      </div>
    );
  }

  // Only proceed if studyDeck has items
  if (studyDeck.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Loading flashcards...</p>
      </div>
    );
  }

  const currentCard = studyDeck[currentIndex];

  // Safety check to make sure currentCard exists
  if (!currentCard) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Error loading flashcard. Please try again.</p>
      </div>
    );
  }

  const shuffleCards = () => {
    const shuffled = [...studyDeck];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setStudyDeck(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleNext = () => {
    if (currentIndex < studyDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Study Mode</h3>
        <button
          onClick={shuffleCards}
          className="flex items-center text-primary hover:text-primary-hover"
        >
          <ShuffleIcon className="w-4 h-4 mr-1" />
          Shuffle
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div 
          className="w-full min-h-[200px] bg-gray-50 rounded-lg p-6 mb-4 cursor-pointer flex items-center justify-center text-center"
          onClick={toggleAnswer}
        >
          <div className="transition-opacity duration-200">
            {showAnswer ? (
              <p className="text-gray-800">{currentCard.answer}</p>
            ) : (
              <p className="text-gray-800 font-medium">{currentCard.question}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Click on card to {showAnswer ? 'see question' : 'reveal answer'}
        </p>

        <div className="flex items-center justify-between w-full">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${
              currentIndex === 0 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <p className="text-sm text-gray-500">
            {currentIndex + 1} of {studyDeck.length}
          </p>

          <button
            onClick={handleNext}
            disabled={currentIndex === studyDeck.length - 1}
            className={`p-2 rounded-full ${
              currentIndex === studyDeck.length - 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudy;
