'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';
import api from '@/lib/axios';
import { toast } from 'sonner';

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const initialDate = searchParams.get('date');
  
  const { lang, t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [isLoading, setIsLoading] = useState(false);

  // 로케일 설정
  const localeMap = { ko, en: enUS, jp: ja };
  const currentLocale = localeMap[lang as keyof typeof localeMap] || ko;

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (editId) {
      const fetchDiary = async () => {
        try {
          const response = await api.get(`/diaries/${editId}`);
          const { title, content, mood, createdAt } = response.data;
          setTitle(title);
          setContent(content);
          setMood(mood);
          setSelectedDate(format(new Date(createdAt), 'yyyy-MM-dd'));
        } catch (error) {
          console.error('일기 불러오기 실패:', error);
          toast.error('일기를 불러오는 데 실패했습니다.');
          router.push('/');
        }
      };
      fetchDiary();
    }
  }, [editId, router]);

  const moods = [
    { emoji: '😊', label: t.mood_happy },
    { emoji: '😎', label: t.mood_proud },
    { emoji: '😭', label: t.mood_sad },
    { emoji: '😡', label: t.mood_angry },
    { emoji: '😴', label: t.mood_tired },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const diaryData = { 
        title, 
        content, 
        mood, 
        createdAt: new Date(selectedDate).toISOString() 
      };

      if (editId) {
        await api.patch(`/diaries/${editId}`, diaryData);
        toast.success("일기가 수정되었습니다.");
      } else {
        await api.post('/diaries', diaryData);
        toast.success(t.save_success);
      }
      router.push('/');
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || '저장에 실패했습니다.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-10 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight text-center">
        {editId ? '📝 일기 수정하기' : `✍️ ${t.write_title}`}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 날짜 선택 섹션 */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">기록할 날짜</label>
          <div className="relative">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-12 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 outline-none transition-all font-bold text-gray-800 dark:text-white"
            />
          </div>
          <p className="text-[10px] text-gray-400 ml-1 italic">
            * {format(parseISO(selectedDate), t.diary_date_with_day_format, { locale: currentLocale })} 기록입니다.
          </p>
        </div>

        {/* 감정 선택 섹션 */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.write_mood_label}</label>
          <div className="flex justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600">
            {moods.map((m) => (
              <button
                key={m.emoji}
                type="button"
                onClick={() => setMood(m.emoji)}
                className={`flex-1 py-3 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  mood === m.emoji 
                  ? 'bg-white dark:bg-gray-600 shadow-md border-yellow-200 dark:border-yellow-500 border-2 scale-105' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500'
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className={`text-xs font-bold ${mood === m.emoji ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.write_title_label}</label>
          <input
            type="text"
            required
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium text-gray-900 dark:text-white"
            placeholder={t.write_title_placeholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.write_content_label}</label>
          <textarea
            required
            rows={10}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium leading-relaxed text-gray-900 dark:text-white"
            placeholder={t.write_content_placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold py-4 rounded-2xl transition-colors"
          >
            {t.cancel}
          </button>
          <Button 
            type="submit"
            disabled={isLoading}
            className="flex-[2] shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20 font-bold py-4 rounded-2xl text-lg transition-transform hover:scale-[1.02]"
          >
            {isLoading ? '저장 중...' : (editId ? '수정 완료' : t.write_save_btn)}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <WriteForm />
    </Suspense>
  );
}
