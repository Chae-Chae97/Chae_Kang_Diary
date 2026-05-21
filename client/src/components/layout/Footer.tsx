'use client';

import { Heart, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="p-8 text-center border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#080c17] transition-colors duration-300 relative overflow-hidden paper-texture">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium text-sm">
          <span>© 2026 My Diary Project.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> by
          </span>
          <span className="font-bold text-gray-600 dark:text-gray-300 hover:text-yellow-600 transition-colors cursor-pointer">CHAE & KANG</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            <span className="hover:text-yellow-600 dark:hover:text-yellow-400 cursor-pointer transition-colors">About</span>
            <span className="hover:text-yellow-600 dark:hover:text-yellow-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-yellow-600 dark:hover:text-yellow-400 cursor-pointer transition-colors">Terms</span>
          </div>
          
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
          
          <a 
            href="https://github.com/Chae-Chae97/Chae_Kang_Diary" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>
        
        <p className="text-[10px] text-gray-300 dark:text-gray-700 font-medium italic">
          {t.footer_desc}
        </p>
      </div>
    </footer>
  );
};