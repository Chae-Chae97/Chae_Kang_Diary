"use client";

import { useState } from "react";
import { X, Edit2, Trash2, Calendar, Bookmark } from "lucide-react";
import { format } from "date-fns";
import { enUS, ko, ja } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '@/context/LanguageContext';

interface Diary {
  id: number;
  title: string;
  preview: string;
  content?: string;
  mood: string;
  date: string;
}

interface DiaryDetailModalProps {
  diary: Diary | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export function DiaryDetailModal({ diary, isOpen, onClose, onDelete, onEdit }: DiaryDetailModalProps) {
  const { lang, t } = useLanguage();

  // 언어에 따른 date-fns 로케일 설정
  const localeMap = {
    ko: ko,
    en: enUS,
    jp: ja
  };
  
  const currentLocale = localeMap[lang] || ko;

  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: 백엔드 API 연동 (PATCH /diaries/:id/bookmark)
  };

  const formattedDate = diary ? format(new Date(diary.date), t.diary_date_with_day_format, { locale: currentLocale }) : "";

  return (
    <AnimatePresence>
      {isOpen && diary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* ... (backdrop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#fefef2] dark:bg-gray-800 w-full max-w-2xl rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative paper-texture flex flex-col md:flex-row h-[600px]"
          >
            {/* 왼쪽 사이드바 (감성 포인트) */}
            <div className="w-full md:w-1/3 bg-yellow-400 p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-4 left-4 border-2 border-black/20 w-8 h-8 rounded-full" />
                <div className="absolute bottom-4 right-4 border-2 border-black/20 w-12 h-12 rounded-full" />
              </div>
              
              <motion.div 
                initial={{ rotate: -10, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                className="text-8xl mb-6 filter drop-shadow-xl"
              >
                {diary.mood}
              </motion.div>
              <div className="text-center">
                <span className="px-4 py-1.5 bg-black/10 rounded-full text-sm font-bold text-black/60 uppercase tracking-widest">
                  {t.modal_mood_title}
                </span>
              </div>

              {/* 책갈피 버튼 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, y: 2 }}
                onClick={toggleBookmark}
                className="absolute -top-1 left-8 outline-none group"
                title="소중한 기록으로 보관"
              >
                <Bookmark 
                  className={`w-10 h-14 transition-colors duration-300 drop-shadow-md ${
                    isBookmarked 
                      ? "text-yellow-600 fill-yellow-600" 
                      : "text-black/20 fill-black/10 group-hover:text-black/30"
                  }`} 
                />
                {isBookmarked && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-16 -left-4 whitespace-nowrap bg-black/80 text-white text-[10px] px-2 py-1 rounded pointer-events-none"
                  >
                    소중한 기록 ✨
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* 오른쪽 일기 본문 (줄 노트 스타일) */}
            <div className="flex-1 p-10 flex flex-col h-full relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="mb-8 border-b-2 border-yellow-200 pb-4">
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 font-bold mb-1">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {diary.title}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto notebook-lines pr-4 custom-scrollbar">
                <p className="text-2xl font-handwriting text-gray-700 dark:text-gray-200 leading-[2rem]">
                  {diary.content || diary.preview}
                </p>
              </div>

              {/* 하단 액션 버튼 */}
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => onEdit(diary.id)}
                  className="flex-1 h-14 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <Edit2 className="w-4 h-4" />
                  {t.modal_edit}
                </button>
                <button 
                  onClick={() => {
                    if(confirm(t.modal_delete_confirm)) onDelete(diary.id);
                  }}
                  className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
