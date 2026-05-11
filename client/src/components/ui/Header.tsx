export const Header = () => {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-gray-700 text-lg">전체 일기</h2>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-500">{today}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* 프로필 대신 간단한 상태 메시지나 알림 아이콘 등을 넣을 수 있습니다 */}
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
          Online
        </span>
      </div>
    </header>
  );
};