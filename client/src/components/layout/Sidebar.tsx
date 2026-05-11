'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-blue-400">My Diary</h1>
      
      <nav className="flex-1 space-y-4">
        <div className="text-gray-400 text-sm font-semibold uppercase">Menu</div>
        <ul className="space-y-2">
          <Link href="/">
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">📅 {t.menu_diary_list}</li>
          </Link>
          <Link href="/write">
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">✍️ {t.menu_new_diary}</li>
          </Link>
          <Link href="/settings">
            <li className="hover:bg-gray-800 p-2 rounded cursor-pointer transition-colors">⚙️ {t.menu_settings}</li>
          </Link>
        </ul>
      </nav>

      <div className="border-t border-gray-800 pt-4 mt-auto text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
        {t.logout}
      </div>
    </aside>
  );
};