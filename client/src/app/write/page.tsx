'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar as CalendarIcon, RefreshCw, Quote, Copy } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { toast } from 'sonner';

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const initialDate = searchParams.get('date');

  const { t, dateLocale } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');
  const [isSpecial, setIsSpecial] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // 오늘의 질문 상태
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    setQuestionIndex(Math.floor(Math.random() * t.write_questions.length));
  }, [t.write_questions]);

  const refreshQuestion = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * t.write_questions.length);
    } while (newIndex === questionIndex);
    setQuestionIndex(newIndex);
  };

  const copyQuestionToContent = () => {
    const question = t.write_questions[questionIndex];
    setContent(prev => prev ? `${prev}\n\nQ: ${question}\nA: ` : `Q: ${question}\nA: `);
    toast.success(t.update_success); // Placeholder for "Question added"
  };

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (editId) {
      const fetchDiary = async () => {
        try {
          const response = await api.get(`/diaries/${editId}`);
          const { title: dTitle, content: dContent, mood: dMood, date: dDate, isSpecial: dIsSpecial } = response.data;
          setTitle(dTitle);
          setContent(dContent);
          setMood(dMood);
          setIsSpecial(dIsSpecial || false);
          setSelectedDate(format(new Date(dDate), 'yyyy-MM-dd'));
        } catch (err: unknown) {
          console.error('일기 불러오기 실패:', err);
          toast.error(t.load_fail);
          router.push('/');
        }
      };
      fetchDiary();
    }
  }, [editId, router, t.load_fail]);

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
        date: new Date(selectedDate).toISOString(),
        isSpecial
      };

      if (editId) {
        await api.patch(`/diaries/${editId}`, diaryData);
        toast.success(t.update_success);
      } else {
        await api.post('/diaries', diaryData);
        toast.success(t.save_success);
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      let message = t.update_fail;
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } };
        message = axiosError.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-10 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight text-center">
        {editId ? `📝 ${t.write_update_title}` : `✍️ ${t.write_title}`}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 날짜 선택 섹션 */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.write_date_label}</label>
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
            * {format(parseISO(selectedDate), t.diary_date_with_day_format, { locale: dateLocale })} {t.write_date_info}
          </p>
        </div>

        {/* 오늘의 질문 섹션 추가 */}
        {!editId && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-[2rem] border border-yellow-100 dark:border-yellow-900/20 relative overflow-hidden group"
          >
            <Quote className="absolute -left-2 -top-2 w-16 h-16 text-yellow-200 dark:text-yellow-900/20 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                  {t.write_question_label}
                </span>
                <button 
                  type="button"
                  onClick={refreshQuestion}
                  className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors text-yellow-600 dark:text-yellow-500"
                  title={t.write_question_refresh}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight">
                "{t.write_questions[questionIndex]}"
              </p>

              <button
                type="button"
                onClick={copyQuestionToContent}
                className="flex items-center gap-2 text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:underline underline-offset-4"
              >
                <Copy className="w-3 h-3" />
                {t.write_question_copy}
              </button>
            </div>
          </motion.div>
        )}

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
                  ? 'bg-white dark:bg-gray-600 shadow-md border-yellow-200 dark:border-yellow-50 border-2 scale-105' 
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
          
          {/* 소중한 기록(isSpecial) 토글 추가 */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setIsSpecial(!isSpecial)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                isSpecial 
                ? "bg-yellow-400 text-black border-yellow-500 shadow-md" 
                : "bg-gray-50 dark:bg-gray-700 text-gray-400 border-gray-100 dark:border-gray-600"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isSpecial ? "bg-yellow-700 animate-pulse" : "bg-gray-300"}`} />
              {isSpecial ? t.write_special_on : t.write_special_off}
            </button>
          </div>

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
            {isLoading ? t.write_saving : (editId ? t.write_update_btn : t.write_save_btn)}
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
