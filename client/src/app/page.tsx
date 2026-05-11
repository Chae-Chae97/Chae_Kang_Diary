'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

// 임시 데이터 (나중에 백엔드 API에서 가져올 데이터의 형태입니다)
const dummyDiaries = [
  {
    id: 1,
    title: "오늘의 프론트엔드 작업",
    date: "2026. 05. 11",
    preview: "메인 페이지 레이아웃을 놓아봤다. 강상! 얼른 백엔드 구현해줘!",
    mood: "😎",
  },
  {
    id: 2,
    title: "도커와 씨름한 날",
    date: "2026. 05. 10",
    preview: "데이터베이스 연결이 이렇게 복잡할 줄이야. 그래도 백엔드 친구가 설정을 잘 마무리해서 다행이다.",
    mood: "🤯",
  },
  {
    id: 3,
    title: "새로운 팀 프로젝트 시작",
    date: "2026. 05. 09",
    preview: "본격적으로 일기장 프로젝트를 시작했다. 어떤 재미있는 기능들을 추가하게 될지 벌써부터 기대가 된다.",
    mood: "🚀",
  }
];

export default function Home() {
  const { t } = useLanguage();
  const isEmpty = dummyDiaries.length === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* 상단: 타이틀 및 액션 버튼 */}
      <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t.home_title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {t.home_count_prefix} <span className="font-semibold text-gray-800 dark:text-gray-200 mx-0.5">{dummyDiaries.length}개</span>{t.home_count_suffix}
          </p>
        </div>
        <Link href="/write">
          <Button variant="primary" className="shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-all gap-2 px-5 py-2.5">
            <span className="text-lg">✍️</span> {t.menu_new_diary}
          </Button>
        </Link>
      </div>

      {/* 중단: 일기 카드 목록 (그리드 레이아웃) */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.home_empty_title}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">{t.home_empty_desc}</p>
          <Link href="/write">
            <Button variant="secondary" size="sm">
              {t.home_first_diary_btn}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyDiaries.map((diary) => (
            <div 
              key={diary.id} 
              className="group bg-white dark:bg-gray-800 p-7 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-64"
            >
              {/* 카드 헤더: 날짜와 감정 이모지 */}
              <div className="flex justify-between items-start mb-5">
                <time className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {diary.date}
                </time>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  <span className="text-3xl">{diary.mood}</span>
                </div>
              </div>
              
              {/* 카드 바디: 제목과 내용 미리보기 */}
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {diary.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 line-clamp-3 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {diary.preview}
              </p>

              {/* 카드 푸터: 더보기 화살표 (UX 암시) */}
              <div className="mt-4 flex items-center text-blue-500 dark:text-blue-400 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {t.home_more} <span className="ml-1">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 하단: 상태 메시지 */}
      {!isEmpty && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm border-t border-gray-100 dark:border-gray-700 border-dashed mt-12 pt-8">
          <p>{t.home_footer_end}</p>
          <p className="mt-1">{t.home_footer_security}</p>
        </div>
      )}
      
    </div>
  );
}