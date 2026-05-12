'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

// 임시 데이터 (나중에 백엔드 API에서 가져올 데이터의 형태입니다)
const DUMMY_DATA = [
  {
    id: 1,
    title: "오늘의 프론트엔드 작업",
    date: "2026-05-12",
    content: "메인 페이지를 캘린더 뷰로 리뉴얼했다. 훨씬 깔끔하고 보기 좋다!",
    mood: "😎",
  },
  {
    id: 2,
    title: "도커와 씨름한 날",
    date: "2026-05-10",
    content: "데이터베이스 연결이 이렇게 복잡할 줄이야. 그래도 백엔드 친구가 설정을 잘 마무리해서 다행이다.",
    mood: "🤯",
  },
  {
    id: 3,
    title: "새로운 팀 프로젝트 시작",
    date: "2026-05-09",
    content: "본격적으로 일기장 프로젝트를 시작했다. 어떤 재미있는 기능들을 추가하게 될지 벌써부터 기대가 된다.",
    mood: "🚀",
  }
];

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('😊');

  // 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (editId) {
      const diaryToEdit = DUMMY_DATA.find(d => d.id === Number(editId));
      if (diaryToEdit) {
        setTitle(diaryToEdit.title);
        setContent(diaryToEdit.content);
        setMood(diaryToEdit.mood);
      }
    }
  }, [editId]);

  const moods = [
    { emoji: '😊', label: t.mood_happy },
    { emoji: '😎', label: t.mood_proud },
    { emoji: '😭', label: t.mood_sad },
    { emoji: '😡', label: t.mood_angry },
    { emoji: '😴', label: t.mood_tired },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editId) {
      console.log('일기 수정:', { id: editId, title, content, mood });
      alert("일기가 수정되었습니다.");
    } else {
      const newDiary = {
          id: Date.now(),
          title,
          content,
          mood,
          date: new Date().toISOString().split('T')[0],
      };
      console.log('새 일기 작성:', newDiary);
      alert(t.save_success);
    }

    router.push('/');
  };

  return (
    <main className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-10 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight text-center">
        {editId ? '📝 일기 수정하기' : `✍️ ${t.write_title}`}
      </h1>
      
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
            className="flex-[2] shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20 font-bold py-4 rounded-2xl text-lg transition-transform hover:scale-[1.02]"
          >
            {editId ? '수정 완료' : t.write_save_btn}
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
