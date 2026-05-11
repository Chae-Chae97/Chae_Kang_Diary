export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-blue-400">My Diary</h1>
      
      <nav className="flex-1 space-y-4">
        <div className="text-gray-400 text-sm font-semibold uppercase">Menu</div>
        <ul className="space-y-2">
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">📅 일기 목록</li>
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">✍️ 새 일기 쓰기</li>
          <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">⚙️ 설정</li>
        </ul>
      </nav>

      <div className="border-t border-gray-800 pt-4 mt-auto text-sm text-gray-400">
        로그아웃
      </div>
    </aside>
  );
};