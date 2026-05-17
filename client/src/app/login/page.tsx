'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 백엔드 API 연동 (POST /auth/login)
    console.log('로그인 시도:', { email, password });
    alert('로그인되었습니다. (데모)');
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200 dark:shadow-none mb-4 rotate-3">
            <LogIn className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">반가워요!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">당신의 오늘을 기록하러 오셨나요?</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">이메일 주소</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">비밀번호</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full py-4 rounded-2xl text-lg font-bold shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            로그인하기
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            아직 회원이 아니신가요?{' '}
            <Link href="/signup" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">
              회원가입 하기
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
