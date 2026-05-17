'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogIn, User, Settings, LogOut, ChevronDown, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const { lang, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 임시 로그인 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const today = new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'en' ? 'en-US' : 'ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl group-hover:rotate-12 transition-transform">📔</span>
          <h2 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            My Diary
          </h2>
        </Link>
        <span className="text-sm text-gray-300 dark:text-gray-600">|</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{today}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-600 shadow-sm"
            >
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-inner">
                JD
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">John Doe</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">내 계정</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1 truncate">john.doe@example.com</p>
                  </div>
                  
                  <div className="p-2">
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-400 rounded-xl transition-colors group">
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>회원 정보 조회</span>
                      </button>
                    </Link>
                    <Link href="/settings" onClick={() => setIsDropdownOpen(false)}>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-400 rounded-xl transition-colors group">
                        <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        <span>설정</span>
                      </button>
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-gray-50 dark:border-gray-700">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors group"
                    >
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* 임시 로그인 버튼 (테스트용) */}
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors mr-2"
            >
              (테스트 로그인)
            </button>
            <Link href="/login">
              <Button variant="secondary" size="sm" className="rounded-full gap-2 border border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700">
                <LogIn className="w-4 h-4" />
                <span>{t.login}</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};