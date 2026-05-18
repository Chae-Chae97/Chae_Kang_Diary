"use client";

import { useState, useMemo } from "react";
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { BookOpen, Sparkles, Bookmark, Search, X, Calendar as CalendarIcon } from "lucide-react";
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
  const { t, dateLocale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "bookmarked">("all");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // 기간 필터 상태
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const formattedDate = format(selectedDate, t.diary_date_format, { locale: dateLocale });

  const moods = ['😊', '😎', '😭', '😡', '😴'];

  // 검색 및 필터링 로직
  const filteredDiaries = useMemo(() => {
    // 아무런 검색/필터 조건이 없을 때만 캘린더 선택 날짜를 기준으로 필터링
    const isNoFilterActive = !searchQuery && filterType === "all" && !selectedMood && !startDate && !endDate;

    return diaries.filter(diary => {
      if (isNoFilterActive) {
        return diary.date && format(parseISO(diary.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      }

      // 1. 검색어 필터
      const matchesSearch = 
        diary.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        diary.preview.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. 북마크 필터
      const matchesFilter = filterType === "all" || (filterType === "bookmarked" && diary.isSpecial);
      
      // 3. 감정 필터
      const matchesMood = !selectedMood || diary.mood === selectedMood;

      // 4. 기간 필터
      let matchesRange = true;
      if (startDate || endDate) {
        try {
          const diaryDate = parseISO(diary.date);
          matchesRange = isWithinInterval(diaryDate, {
            start: startDate ? startOfDay(parseISO(startDate)) : new Date(0),
            end: endDate ? endOfDay(parseISO(endDate)) : new Date(8640000000000000)
          });
        } catch (e) {
          matchesRange = true;
        }
      }
      
      return matchesSearch && matchesFilter && matchesMood && matchesRange;
    });
  }, [diaries, searchQuery, filterType, selectedMood, startDate, endDate, selectedDate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* 상단 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        
        <div className="flex items-center gap-2">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 shadow-sm"
          >
            {t.diary_count.replace('{count}', filteredDiaries.length.toString())}
          </motion.span>
        </div>
      </div>

      {/* 검색 및 필터 바 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.diary_search_placeholder}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900/20 focus:border-yellow-400 transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-50 dark:border-gray-700">
            <button 
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === "all" 
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {t.diary_filter_all}
            </button>
            <button 
              onClick={() => setFilterType("bookmarked")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                filterType === "bookmarked" 
                  ? "bg-yellow-400 text-black shadow-sm" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <Bookmark className={`w-3 h-3 ${filterType === "bookmarked" ? "fill-black" : ""}`} />
              {t.diary_filter_bookmarked}
            </button>
          </div>
        </div>

        {/* 기간 필터 섹션 */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Period</span>
          </div>
          
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 sm:w-36 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
            />
            <span className="text-gray-300 font-bold">~</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 sm:w-36 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
            />
          </div>

          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 underline underline-offset-4 ml-auto"
            >
              RESET PERIOD
            </button>
          )}
        </div>
      </motion.div>

      {/* 감정 필터 바 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 items-center"
      >
        <button 
          onClick={() => setSelectedMood(null)}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            selectedMood === null 
              ? "bg-gray-900 text-white border-gray-900 shadow-md dark:bg-gray-100 dark:text-gray-900" 
              : "bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
          }`}
        >
          {t.diary_filter_all_mood || "ALL MOODS"}
        </button>
        <div className="flex gap-1.5 p-1 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMood(selectedMood === m ? null : m)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                selectedMood === m 
                  ? "bg-white dark:bg-gray-700 shadow-sm border-2 border-yellow-200 dark:border-yellow-500 scale-110" 
                  : "hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm opacity-50 hover:opacity-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 리스트 본문 */}
      <AnimatePresence mode="wait">
        {filteredDiaries.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-gray-800/30 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="relative mb-6">
              <div className="text-7xl opacity-20 rotate-12">🔍</div>
              <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <p className="text-xl font-bold text-gray-400 dark:text-gray-500">{t.diary_empty_title}</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-2 max-w-[250px] text-center">{t.diary_empty_desc}</p>
            {(searchQuery || filterType !== "all" || selectedMood || startDate || endDate) && (
              <button 
                onClick={() => { 
                  setSearchQuery(""); 
                  setFilterType("all"); 
                  setSelectedMood(null);
                  setStartDate("");
                  setEndDate("");
                }}
                className="mt-6 text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:underline"
              >
                필터 초기화하기
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredDiaries.map((diary) => (
              <motion.div 
                key={diary.id}
                variants={item}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDiaryClick(diary)}
                className="glass p-6 rounded-[2rem] border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-yellow-100 dark:hover:shadow-none transition-all cursor-pointer group relative overflow-hidden"
              >
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
