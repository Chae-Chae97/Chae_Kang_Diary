'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { DiaryCalendar } from '@/components/diary/DiaryCalendar';
import { DiaryList } from '@/components/diary/DiaryList';
import { DiaryDetailModal } from '@/components/diary/DiaryDetailModal';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

interface Diary {
  id: number;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // 모달 상태
  const [selectedDiary, setSelectedDiary] = useState<Diary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. 로그인 체크 및 일기 목록 불러오기
  useEffect(() => {
    if (!isMounted) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDiaries = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/diaries');
        setDiaries(response.data);
      } catch (error: any) {
        console.error('일기 목록 로드 실패:', error);
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, [router, isMounted]);

  if (!isMounted) return null;

  if (!isAuthenticated && !localStorage.getItem('accessToken')) {
    return <div className="text-center py-20 text-gray-500 font-medium">로그인이 필요합니다. 이동 중...</div>;
  }

  // 일기가 있는 날짜들의 목록 (YYYY-MM-DD 형식으로 변환)
  const diaryDates = diaries.map(d => format(new Date(d.createdAt), 'yyyy-MM-dd'));

  // 선택된 날짜에 해당하는 일기들 필터링
  const filteredDiaries = diaries.filter(diary => {
    return format(new Date(diary.createdAt), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  });

  const handleDiaryClick = (diary: Diary) => {
    setSelectedDiary(diary);
    setIsModalOpen(true);
  };

  const handleDeleteDiary = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await api.delete(`/diaries/${id}`);
      setDiaries(prev => prev.filter(d => d.id !== id));
      setIsModalOpen(false);
      alert('일기가 삭제되었습니다.');
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
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
          {isLoading ? (
            <div className="text-center py-20 text-gray-500 font-medium">데이터를 불러오는 중입니다...</div>
          ) : (
            <DiaryList 
              selectedDate={selectedDate} 
              diaries={filteredDiaries.map(d => ({
                id: d.id,
                title: d.title,
                preview: d.content,
                mood: d.mood,
                date: format(new Date(d.createdAt), 'yyyy-MM-dd')
              }))} 
              onDiaryClick={(diary) => handleDiaryClick(diaries.find(d => d.id === diary.id)!)}
            />
          )}
        </div>
      </div>

      {/* 일기 상세 모달 */}
      <DiaryDetailModal 
        diary={selectedDiary ? {
          ...selectedDiary,
          preview: selectedDiary.content,
          date: format(new Date(selectedDiary.createdAt), 'yyyy-MM-dd')
        } : null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteDiary}
        onEdit={handleEditDiary}
      />
      
    </div>
  );
}
