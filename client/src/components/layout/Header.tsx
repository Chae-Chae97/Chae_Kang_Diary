'use client';

import { useLanguage } from '@/context/LanguageContext';

export const Header = () => {
  const { lang } = useLanguage();
  
  const today = new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'en' ? 'en-US' : 'ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">My Diary</h2>
        <span className="text-sm text-gray-400 dark:text-gray-500">|</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{today}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
          Online
        </span>
      </div>
    </header>
  );
};