import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { levels } from '../data/flashcards';

interface ProgressData {
  [levelId: string]: {
    viewedCards: string[];
    totalCards: number;
  };
}

export function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      
      const newProgress: ProgressData = {};
      
      for (const levelId of Object.keys(levels)) {
        try {
          const progressRef = doc(db, 'users', user.uid, 'progress', levelId);
          const progressSnap = await getDoc(progressRef);
          
          if (progressSnap.exists()) {
            newProgress[levelId] = {
              viewedCards: progressSnap.data().viewedCards || [],
              totalCards: levels[levelId].cards.length
            };
          } else {
            newProgress[levelId] = {
              viewedCards: [],
              totalCards: levels[levelId].cards.length
            };
          }
        } catch (error) {
          console.error('Error fetching progress for level', levelId, error);
          newProgress[levelId] = { viewedCards: [], totalCards: levels[levelId].cards.length };
        }
      }
      
      setProgress(newProgress);
      setLoading(false);
    }

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2 text-claude-text dark:text-gray-100">Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! 👋</h1>
        <p className="text-claude-muted dark:text-gray-400 text-lg">Ready to learn some new English words today?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.values(levels).map((level, index) => {
          const levelProgress = progress[level.id];
          const percentage = levelProgress 
            ? Math.round((levelProgress.viewedCards.length / levelProgress.totalCards) * 100) 
            : 0;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/study/${level.id}`}
                className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-1 text-claude-text dark:text-gray-100">{level.title}</h2>
                    <p className="text-sm text-claude-muted dark:text-gray-400 line-clamp-2">{level.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-claude-accent/10 dark:bg-claude-accent/20 flex items-center justify-center text-claude-accent group-hover:bg-claude-accent group-hover:text-white transition-colors">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-claude-muted dark:text-gray-400">Progress</span>
                    <span className="text-claude-accent font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="bg-claude-accent h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-claude-muted dark:text-gray-500 mt-2 text-right">
                    {levelProgress?.viewedCards.length || 0} / {levelProgress?.totalCards || 0} cards
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
