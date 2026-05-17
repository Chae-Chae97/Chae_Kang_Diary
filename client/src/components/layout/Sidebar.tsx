'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, PenLine, Settings, LogOut, BookText, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { icon: <Calendar className="w-5 h-5" />, label: t.menu_diary_list, href: '/' },
    { icon: <PenLine className="w-5 h-5" />, label: t.menu_new_diary, href: '/write' },
    { icon: <PieChart className="w-5 h-5" />, label: t.menu_stats, href: '/stats' },
    { icon: <Settings className="w-5 h-5" />, label: t.menu_settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#080c17] text-gray-800 dark:text-gray-100 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-100 dark:border-gray-800 transition-colors duration-300 z-40">
      {/* 로고 섹션 */}
      <div className="p-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200 dark:shadow-none group-hover:rotate-6 transition-transform">
            <BookText className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
            My Diary
          </h1>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 space-y-8">
        <div>
          <p className="px-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link href={item.href} key={item.href}>
                  <li className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                    isActive 
                      ? 'bg-yellow-400 text-black font-bold shadow-md shadow-yellow-100 dark:shadow-none' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                  }`}>
                    <span className={`${isActive ? 'text-black' : 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400'} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="text-sm tracking-tight">{item.label}</span>

                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute left-0 w-1 h-6 bg-black rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 푸터 (버전 정보 등으로 대체 가능) */}
      <div className="p-6 border-t border-gray-50 dark:border-gray-800 text-center">
        <p className="text-[10px] text-gray-300 dark:text-gray-600 font-bold uppercase tracking-widest">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
};