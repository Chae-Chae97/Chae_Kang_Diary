'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { DiaryCalendar } from '@/components/diary/DiaryCalendar';
import { DiaryList } from '@/components/diary/DiaryList';
import { DiaryDetailModal } from '@/components/diary/DiaryDetailModal';
import { useLanguage } from '@/context/LanguageContext';

interface Diary {
  id: number;
  title: string;
  preview: string;
  mood: string;
  date: string;
}

// 임시 데이터 (나중에 백엔드 API에서 가져올 데이터의 형태입니다)
const INITIAL_DIARIES = [
  {
    id: 1,
    title: "오늘의 프론트엔드 작업",
    date: "2026-05-12",
    preview: "메인 페이지를 캘린더 뷰로 리뉴얼했다. 훨씬 깔끔하고 보기 좋다!",
    mood: "😎",
  },
  {
    id: 2,
    title: "도커와 씨름한 날",
    date: "2026-05-10",
    preview: "데이터베이스 연결이 이렇게 복잡할 줄이야. 그래도 백엔드 친구가 설정을 잘 마무리해서 다행이다.",
    mood: "🤯",
  },
  {
    id: 3,
    title: "새로운 팀 프로젝트 시작",
    date: "2026-05-09",
    preview: "본격적으로 일기장 프로젝트를 시작했다. 어떤 재미있는 기능들을 추가하게 될지 벌써부터 기대가 된다.",
    mood: "🚀",
  }
];

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaries, setDiaries] = useState<Diary[]>(INITIAL_DIARIES);
  
  // 모달 상태
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 일기가 있는 날짜들의 목록
  const diaryDates = diaries.map(d => d.date);

  // 선택된 날짜에 해당하는 일기들 필터링
  const filteredDiaries = diaries.filter(diary => {
    return diary.date === format(selectedDate, 'yyyy-MM-dd');
  });

  const handleDiaryClick = (diary: Diary) => {
    setSelectedDiary(diary);
    setIsModalOpen(true);
  };

  const handleDeleteDiary = (id: number) => {
    setDiaries(prev => prev.filter(d => d.id !== id));
    setIsModalOpen(false);
    // TODO: 백엔드 API 호출 (DELETE /diaries/:id)
  };

  const handleEditDiary = (id: number) => {
    router.push(`/write?id=${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      
      {/* 상단: 타이틀 및 액션 버튼 */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t.home_title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {t.home_desc}
          </p>
        </div>
        <Link href="/write">
          <Button variant="primary" className="rounded-full gap-2 px-6 shadow-md hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" />
            {t.menu_new_diary}
          </Button>
        </Link>
      </div>

      {/* 메인 콘텐츠: 캘린더와 리스트 분할 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* 좌측: 캘린더 (4컬럼) */}
        <div className="lg:col-span-4 sticky top-6">
          <DiaryCalendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            diaryDates={diaryDates}
          />
          
          <div className="mt-6 p-5 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100/50 dark:border-yellow-900/20">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.home_tip }}>
            </p>
          </div>
        </div>

        {/* 우측: 일기 목록 (8컬럼) */}
        <div className="lg:col-span-8">
          <DiaryList 
            selectedDate={selectedDate} 
            diaries={filteredDiaries} 
            onDiaryClick={handleDiaryClick}
          />
        </div>
      </div>

      {/* 일기 상세 모달 */}
      <DiaryDetailModal 
        diary={selectedDiary}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteDiary}
        onEdit={handleEditDiary}
      />
      
    </div>
  );
}
