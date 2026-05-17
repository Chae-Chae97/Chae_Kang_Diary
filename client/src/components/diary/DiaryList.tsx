"use client";

import { format } from "date-fns";
import { enUS, ko, ja } from "date-fns/locale";
import { BookOpen, Sparkles, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';

interface Diary {
  id: number;
  title: string;
  preview: string;
  mood: string;
  date: string;
  isSpecial?: boolean;
}

interface DiaryListProps {
  selectedDate: Date;
  diaries: Diary[];
  onDiaryClick: (diary: Diary) => void;
}

export function DiaryList({ selectedDate, diaries, onDiaryClick }: DiaryListProps) {
  const { lang, t } = useLanguage();

  // 언어에 따른 date-fns 로케일 설정
  const localeMap = {
    ko: ko,
    en: enUS,
    jp: ja
  };
  
  const currentLocale = localeMap[lang] || ko;

  const formattedDate = format(selectedDate, t.diary_date_format, { locale: currentLocale });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
        >
          <div className="p-2 bg-yellow-400 rounded-xl shadow-yellow-200 shadow-lg">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          {formattedDate}{t.diary_list_title}
        </motion.h2>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 shadow-sm"
        >
          {t.diary_count.replace('{count}', diaries.length.toString())}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {diaries.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-gray-800/30 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="relative mb-6">
              <div className="text-7xl opacity-20">📔</div>
              <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <p className="text-xl font-bold text-gray-400 dark:text-gray-500">{t.diary_empty_title}</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">{t.diary_empty_desc}</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {diaries.map((diary) => (
              <motion.div 
                key={diary.id}
                variants={item}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDiaryClick(diary)}
                className="glass p-6 rounded-[2rem] border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-yellow-100 dark:hover:shadow-none transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* 배경 포인트 */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                        {diary.title}
                      </h3>
                      {diary.isSpecial && (
                        <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                  <div className="text-3xl filter drop-shadow-md transform group-hover:rotate-12 transition-transform">
                    {diary.mood}
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 text-sm relative z-10">
                  {diary.preview}
                </p>
                
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.diary_read_more} <span>→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
