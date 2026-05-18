'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Quote, X, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/axios';

export function DailyMotivational() {
  const { t } = useLanguage();
  const [quote, setQuote] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // 스트릭 데이터 페칭
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/diaries/stats');
      return response.data;
    },
  });

  const currentStreak = stats?.currentStreak || 0;

  useEffect(() => {
    // 랜덤 문구 선택
    const quotes = t.motivation_quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // 팝업 표시 여부 (하루에 한 번만 표시되도록 로컬스토리지 활용 가능)
    const lastShown = localStorage.getItem('lastQuoteShown');
    const today = new Date().toISOString().split('T')[0];

    if (lastShown !== today) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem('lastQuoteShown', today);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [t.motivation_quotes]);

  return (
    <>
      {/* 스트릭 표시 바 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
      >
        <div className={`p-2 rounded-xl ${currentStreak > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
          <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'fill-orange-500 animate-pulse' : ''}`} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1">
            {t.streak_current}
          </p>
          <p className="text-lg font-black text-gray-800 dark:text-gray-100 leading-none">
            {currentStreak} <span className="text-sm font-bold text-gray-500">{t.streak_days}</span>
          </p>
        </div>
        {currentStreak >= 3 && (
          <div className="ml-2 p-1.5 bg-yellow-100 text-yellow-600 rounded-full">
            <Trophy className="w-4 h-4" />
          </div>
        )}
      </motion.div>

      {/* 오늘의 문구 팝업 */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-6 md:p-12 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-yellow-400 text-black p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-yellow-200 dark:shadow-none max-w-lg w-full pointer-events-auto relative overflow-hidden"
            >
              {/* 장식용 따옴표 */}
              <Quote className="absolute -left-4 -top-4 w-24 h-24 text-black/5 -rotate-12" />
              
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {t.motivation_title}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black leading-tight">
                  "{quote}"
                </h3>

                <p className="text-sm font-bold opacity-60">
                  {t.motivation_footer}
                </p>
              </div>

              {/* 하단 스트라이프 장식 */}
              <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="flex-1 bg-black/10" />
                <div className="flex-1 bg-transparent" />
                <div className="flex-1 bg-black/10" />
                <div className="flex-1 bg-transparent" />
                <div className="flex-1 bg-black/10" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
