import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { levels } from '../data/flashcards';
import { cn } from '../lib/utils';

export function Study() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const level = levelId ? levels[levelId] : null;
  const cards = level?.cards || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!level || !user) {
      if (!level) navigate('/');
      return;
    }

    async function fetchProgress() {
      try {
        const progressRef = doc(db, 'users', user!.uid, 'progress', levelId!);
        const progressSnap = await getDoc(progressRef);
        
        if (progressSnap.exists()) {
          const data = progressSnap.data();
          setViewedCards(new Set(data.viewedCards || []));
        }
      } catch (error) {
        console.error('Error fetching progress', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [levelId, user, level, navigate]);

  // Mark card as viewed when flipped
  useEffect(() => {
    if (isFlipped && cards[currentIndex] && user && levelId) {
      const cardId = cards[currentIndex].id;
      if (!viewedCards.has(cardId)) {
        const newViewed = new Set(viewedCards);
        newViewed.add(cardId);
        setViewedCards(newViewed);
        
        // Save to Firestore
        const progressRef = doc(db, 'users', user.uid, 'progress', levelId);
        setDoc(progressRef, {
          viewedCards: Array.from(newViewed),
          lastAccessed: serverTimestamp()
        }, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/progress/${levelId}`);
        });
      }
    }
  }, [isFlipped, currentIndex, cards, user, levelId, viewedCards]);

  if (loading || !level) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const currentCard = cards[currentIndex];
  const progressPercentage = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate('/')}
          className="p-2 -ml-2 text-claude-muted hover:text-claude-text dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <h2 className="font-serif font-bold text-xl text-claude-text dark:text-gray-100">{level.title}</h2>
          <p className="text-sm text-claude-muted dark:text-gray-400">
            {currentIndex + 1} of {cards.length}
          </p>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1 mb-8">
        <motion.div 
          className="bg-claude-accent h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Flashcard Container */}
      <div className="flex-1 relative perspective-1000 flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full max-h-[400px] relative cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="w-full h-full relative preserve-3d duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-claude-accent mb-4 uppercase tracking-widest">English</span>
                <h3 className="text-4xl sm:text-5xl font-serif font-bold text-claude-text dark:text-white leading-tight">{currentCard.question}</h3>
                <p className="absolute bottom-8 text-xs text-claude-muted flex items-center gap-2 opacity-60">
                  <RotateCcw className="w-3 h-3" /> Tap to reveal
                </p>
              </div>

              {/* Back */}
              <div 
                className="absolute w-full h-full backface-hidden bg-[#fffdfa] dark:bg-gray-800/90 rounded-3xl shadow-sm border border-claude-accent/20 dark:border-claude-accent/30 p-8 flex flex-col items-center justify-center text-center"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <span className="text-xs font-bold text-claude-accent mb-4 uppercase tracking-widest">Translation</span>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-claude-text dark:text-white mb-4 leading-tight">{currentCard.answer}</h3>
                {currentCard.extraInfo && (
                  <p className="text-claude-muted dark:text-gray-300 text-base mt-4 max-w-sm italic">
                    {currentCard.extraInfo}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 pb-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-claude-text dark:text-gray-200"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-claude-accent hover:bg-claude-accent/90 text-white shadow-sm"
        >
          Next <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
