import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User as UserIcon, Camera, Save, CheckCircle2, BookOpen } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { levels } from '../data/flashcards';

export function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stats, setStats] = useState({ totalViewed: 0, totalCards: 0 });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      let viewed = 0;
      let total = 0;

      // Calculate total possible cards
      Object.values(levels).forEach(level => {
        total += level.cards.length;
      });

      try {
        const progressRef = collection(db, 'users', user.uid, 'progress');
        const snap = await getDocs(progressRef);
        
        snap.forEach(doc => {
          const data = doc.data();
          if (data.viewedCards) {
            viewed += data.viewedCards.length;
          }
        });
        
        setStats({ totalViewed: viewed, totalCards: total });
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    }

    fetchStats();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setSaving(false);
    }
  };

  const overallProgress = stats.totalCards > 0 
    ? Math.round((stats.totalViewed / stats.totalCards) * 100) 
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2 text-claude-text dark:text-gray-100">Profile</h1>
        <p className="text-claude-muted dark:text-gray-400 text-lg">Manage your account and view your overall progress.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={photoURL || `https://ui-avatars.com/api/?name=${displayName || 'User'}&size=128`} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <button 
                  type="button"
                  className="absolute -bottom-2 -right-2 p-2 bg-claude-accent text-white rounded-xl shadow-lg hover:bg-claude-accent/90 transition-colors"
                  onClick={() => {
                    const url = prompt('Enter new image URL:', photoURL);
                    if (url !== null) setPhotoURL(url);
                  }}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-claude-text dark:text-gray-100">{user?.email}</h3>
                <p className="text-sm text-claude-muted dark:text-gray-400">Connected via Google</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-claude-muted dark:text-gray-400 mb-2 uppercase tracking-wider">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-claude-accent/20 focus:border-claude-accent outline-none transition-all text-claude-text dark:text-gray-200"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-claude-muted dark:text-gray-400 mb-2 uppercase tracking-wider">Photo URL</label>
                <input 
                  type="url" 
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-claude-accent/20 focus:border-claude-accent outline-none transition-all text-claude-text dark:text-gray-200"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-claude-accent hover:bg-claude-accent/90 text-white px-6 py-4 rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : saved ? (
                <><CheckCircle2 className="w-5 h-5" /> Changes Saved</>
              ) : (
                <><Save className="w-5 h-5" /> Save Profile</>
              )}
            </button>
          </form>
        </div>

        {/* Stats Card */}
        <div className="bg-claude-accent rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white/80 mb-1 uppercase tracking-widest text-xs">Total Progress</h3>
            <div className="text-5xl font-serif font-bold mb-6">{overallProgress}%</div>
            
            <div className="w-full bg-black/10 rounded-full h-2 mb-3">
              <motion.div 
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-white/70">
              {stats.totalViewed} of {stats.totalCards} cards mastered
            </p>
          </div>
          
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-widest font-bold">Current Status</p>
                <p className="font-serif text-xl font-bold">
                  {overallProgress < 33 ? 'Beginner' : overallProgress < 66 ? 'Intermediate' : 'Advanced'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
