'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookText, Bookmark, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/axios';
import { DiaryDetailModal } from '@/components/diary/DiaryDetailModal';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Diary {
  id: number;
  title: string;
  content: string;
  mood: string;
  date: string;
  isSpecial: boolean;
}

interface GroupedDiaries {
  [year: string]: {
    [month: string]: Diary[];
  };
}

export default function ArchivePage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  // 모달 상태
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 페칭 (React Query)
  const { data: diaries = [], isLoading } = useQuery<Diary[]>({
    queryKey: ['diaries'],
    queryFn: async () => {
      const response = await api.get('/diaries');
      return response.data;
    },
  });

  // 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/diaries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
      setIsModalOpen(false);
      toast.success(t.delete_success);
    },
    onError: () => {
      toast.error(t.delete_fail);
    },
  });

  // 연도별/월별 그룹화 로직
  const groupedData = useMemo(() => {
    const groups: GroupedDiaries = {};
    const sortedDiaries = [...diaries].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

    sortedDiaries.forEach(diary => {
      const date = parseISO(diary.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();

      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = [];
      
      groups[year][month].push(diary);
    });

    return groups;
  }, [diaries]);

  const handleDiaryClick = (diary: Diary) => {
    setSelectedDiary(diary);
    setIsModalOpen(true);
  };

  const handleUpdateDiary = (updated: Diary) => {
    queryClient.setQueryData(['diaries'], (old: Diary[] | undefined) => {
      if (!old) return [updated];
      return old.map(d => d.id === updated.id ? updated : d);
    });
    setSelectedDiary(updated);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full" 
        />
        <p className="text-gray-400 font-bold animate-pulse">{t.archive_loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 space-y-12">
      <header className="space-y-3">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-100 dark:shadow-none">
            <BookText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {t.archive_title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t.archive_desc}
            </p>
          </div>
        </motion.div>
      </header>

      {diaries.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 text-gray-300 dark:text-gray-700 font-bold"
        >
          <div className="text-8xl mb-6 opacity-30">📁</div>
          <p className="text-xl">{t.archive_empty}</p>
        </motion.div>
      ) : (
        <div className="space-y-20">
          {Object.entries(groupedData).sort(([a], [b]) => Number(b) - Number(a)).map(([year, months], yearIdx) => (
            <section key={year} className="space-y-8">
              {/* 연도 구분선 */}
              <div className="relative flex items-center gap-6">
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {year}
                </h2>
                <div className="h-[2px] bg-gray-200 dark:bg-gray-800 flex-1 rounded-full relative overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    whileInView={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-1/3"
                  />
                </div>
              </div>

              {/* 월별 그리드 (Mini Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(months).sort(([a], [b]) => Number(b) - Number(a)).map(([month, monthDiaries], monthIdx) => (
                  <motion.div 
                    key={month}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (yearIdx * 0.1) + (monthIdx * 0.05) }}
                    viewport={{ once: true }}
                    className="group flex flex-col bg-white dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all duration-300 overflow-hidden min-h-[360px] max-h-[500px]"
                  >
                    {/* 카드 상단: 월 정보 */}
                    <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl group-hover:bg-yellow-400 transition-colors duration-300">
                          <CalendarDays className="w-4 h-4 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">
                          {month}{t.month_suffix}
                        </h3>
                      </div>
                      <span className="text-[10px] font-black bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 px-3 py-1 rounded-full">
                        {monthDiaries.length} {t.archive_records}
                      </span>
                    </div>

                    {/* 카드 본문: 일기 목록 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                      {monthDiaries.map((diary) => (
                        <button
                          key={diary.id}
                          onClick={() => handleDiaryClick(diary)}
                          className="w-full text-left p-3 rounded-2xl hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors group/item"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl leading-none mt-1">{diary.mood}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                                  {format(parseISO(diary.date), 'dd')}{t.day_suffix}
                                </span>
                                {diary.isSpecial && (
                                  <Bookmark className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate group-hover/item:text-yellow-700 dark:group-hover/item:text-yellow-400">
                                {diary.title}
                              </h4>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* 카드 하단: 장식용 푸터 */}
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-900/20 text-center">
                      <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 mx-auto rounded-full group-hover:w-20 group-hover:bg-yellow-200 transition-all duration-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 일기 상세 모달 */}
      <DiaryDetailModal 
        diary={selectedDiary ? {
          ...selectedDiary,
          preview: selectedDiary.content,
          date: format(parseISO(selectedDiary.date), 'yyyy-MM-dd')
        } : null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={(id) => deleteMutation.mutate(id)}
        onEdit={(id) => (window.location.href = `/write?id=${id}`)}
        onUpdate={handleUpdateDiary}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.3);
        }
      `}</style>
    </div>
  );
}
