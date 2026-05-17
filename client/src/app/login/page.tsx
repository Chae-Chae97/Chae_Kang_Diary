'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. 로그인 요청
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;

      // 2. 토큰 저장
      localStorage.setItem('accessToken', accessToken);

      // 3. 유저 정보 가져오기
      const userResponse = await api.get('/auth/me');
      
      // 4. 전역 상태 업데이트
      setAuth({
        id: userResponse.data.id,
        email: userResponse.data.email,
        nickname: userResponse.data.profile?.nickname || '사용자',
      });

      alert('로그인되었습니다!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
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
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-11 pr-12 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer select-none"
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-lg font-bold shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? '로그인 중...' : '로그인하기'}
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
