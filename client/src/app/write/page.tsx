'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function WritePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');

  const moods = [
    { emoji: '😊', label: t.mood_happy },
    { emoji: '😎', label: t.mood_proud },
    { emoji: '😭', label: t.mood_sad },
    { emoji: '😡', label: t.mood_angry },
    { emoji: '😴', label: t.mood_tired },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //백엔드 연결 전 임시
    const newDiary = {
        id: Date.now(),
        title,
        content,
        mood,
        date: new Date().toLocaleDateString(),
    };

    console.log('새 일기:', newDiary);
    alert(t.save_success);

    //작성 후 메인 페이지로 이동
    router.push('/');
    };

    return (
        <main className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-10 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight text-center">✍️ {t.write_title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
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
                  ? 'bg-white dark:bg-gray-600 shadow-md border-blue-200 dark:border-blue-500 border-2 scale-105' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500'
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className={`text-xs font-bold ${mood === m.emoji ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
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
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium text-gray-900 dark:text-white"
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
            className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium leading-relaxed text-gray-900 dark:text-white"
            placeholder={t.write_content_placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            type="button" 
            onClick={() => router.back()} 
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border-none font-bold py-4 rounded-2xl"
          >
            {t.cancel}
          </Button>
          <Button 
            type="submit"
            className="flex-[2] shadow-lg shadow-blue-100 dark:shadow-blue-900 font-bold py-4 rounded-2xl text-lg transition-transform hover:scale-[1.02]"
          >
            {t.write_save_btn}
          </Button>
        </div>
      </form>
    </main>
  );
}
