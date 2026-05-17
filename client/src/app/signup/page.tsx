'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 실제 백엔드 API 호출 (POST /auth/signup)
      // DTO 규격에 맞춰 email, password, nickname(name) 전달
      await api.post('/auth/signup', { 
        email, 
        password, 
        nickname: name 
      });

      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200 dark:shadow-none mb-4 -rotate-3">
            <UserPlus className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">처음이신가요?</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">나만의 일기장을 만들어보세요.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">이름</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-11 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
                placeholder="8자 이상 입력해주세요"
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

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">비밀번호 확인</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="w-full pl-11 pr-12 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-600 focus:ring-4 focus:ring-yellow-50 dark:focus:ring-yellow-900 focus:border-yellow-400 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 font-medium"
                placeholder="다시 한번 입력해주세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onMouseDown={() => setShowConfirmPassword(true)}
                onMouseUp={() => setShowConfirmPassword(false)}
                onMouseLeave={() => setShowConfirmPassword(false)}
                onTouchStart={() => setShowConfirmPassword(true)}
                onTouchEnd={() => setShowConfirmPassword(false)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer select-none"
              >
                {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-lg font-bold shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20 transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4"
          >
            {isLoading ? '가입 중...' : '가입하기'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">
              로그인 하기
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
