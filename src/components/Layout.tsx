import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, User as UserIcon, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-claude-bg dark:bg-claude-dark-bg text-claude-text dark:text-gray-200 transition-colors duration-300 flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-serif font-bold text-2xl text-claude-accent">
            <BookOpen className="w-6 h-6" />
            <span>LingoCards</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-claude-muted dark:text-gray-400"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-4">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                  referrerPolicy="no-referrer"
                />
                <span className="font-medium text-sm text-claude-text dark:text-gray-200">{user.displayName}</span>
              </Link>
              <button
                onClick={signOut}
                className="p-2 text-claude-muted hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="mt-auto py-8 border-t border-gray-200/50 dark:border-gray-700/50 text-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-claude-muted dark:text-gray-400 text-sm">
            © 2026 Aura do Clima. Desenvolvido por <a href="https://otaviogusto.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-claude-accent hover:underline font-medium">Otávio Gusto</a>.
          </p>
          <p className="text-claude-muted dark:text-gray-500 text-xs mt-2 uppercase tracking-widest font-medium">
            Soluções tecnológicas para o seu negócio.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden sticky bottom-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 flex justify-around items-center h-16 pb-safe z-20">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium transition-colors",
            location.pathname === '/' ? "text-claude-accent" : "text-claude-muted dark:text-gray-400 hover:text-claude-text dark:hover:text-gray-100"
          )}
        >
          <BookOpen className="w-5 h-5" />
          <span>Study</span>
        </Link>
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium transition-colors",
            location.pathname === '/profile' ? "text-claude-accent" : "text-claude-muted dark:text-gray-400 hover:text-claude-text dark:hover:text-gray-100"
          )}
        >
          <UserIcon className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
