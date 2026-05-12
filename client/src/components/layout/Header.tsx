'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

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
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl group-hover:rotate-12 transition-transform">📔</span>
          <h2 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            My Diary
          </h2>
        </Link>
        <span className="text-sm text-gray-300 dark:text-gray-600">|</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{today}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
          Online
        </span>
      </div>
    </header>
  );
};