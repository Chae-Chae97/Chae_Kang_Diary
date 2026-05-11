// client/src/app/page.tsx
import { Button } from '@/components/ui/Button';

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
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* 상단: 타이틀 및 액션 버튼 */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">나의 일기장</h1>
          <p className="text-gray-500 text-sm mt-1">지금까지 총 {dummyDiaries.length}개의 기록이 있습니다.</p>
        </div>
        <Button variant="primary" className="shadow-sm">
          ✍️ 새 일기 쓰기
        </Button>
      </div>

      {/* 중단: 일기 카드 목록 (그리드 레이아웃) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyDiaries.map((diary) => (
          <div 
            key={diary.id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-56"
          >
            {/* 카드 헤더: 날짜와 감정 이모지 */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                {diary.date}
              </span>
              <span className="text-2xl">{diary.mood}</span>
            </div>
            
            {/* 카드 바디: 제목과 내용 미리보기 */}
            <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">{diary.title}</h2>
            <p className="text-gray-600 text-sm flex-1 line-clamp-3 leading-relaxed">
              {diary.preview}
            </p>
          </div>
        ))}
      </div>

      {/* 하단: 상태 메시지 */}
      <div className="text-center py-10 text-gray-400 text-sm border-t border-gray-100 border-dashed mt-8 pt-8">
        더 이상 불러올 일기가 없습니다.
      </div>
      
    </div>
  );
}