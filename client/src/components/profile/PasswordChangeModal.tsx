'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await api.patch('/auth/password', {
        currentPassword,
        newPassword
      });
      alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해 주세요.');
      onClose();
      // 로그아웃 처리 등을 추가할 수 있습니다.
      window.location.href = '/login';
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-700 p-8"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-100 dark:shadow-none mb-4">
                <ShieldAlert className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">비밀번호 변경</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">안전한 계정 관리를 위해 비밀번호를 수정합니다.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 현재 비밀번호 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">현재 비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-50 outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowCurrent(true)}
                    onMouseUp={() => setShowCurrent(false)}
                    onMouseLeave={() => setShowCurrent(false)}
                    onTouchStart={() => setShowCurrent(true)}
                    onTouchEnd={() => setShowCurrent(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 transition-colors"
                  >
                    {showCurrent ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">새 비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-50 outline-none transition-all font-medium"
                    placeholder="8자 이상 입력"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowNew(true)}
                    onMouseUp={() => setShowNew(false)}
                    onMouseLeave={() => setShowNew(false)}
                    onTouchStart={() => setShowNew(true)}
                    onTouchEnd={() => setShowNew(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 transition-colors"
                  >
                    {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 확인 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">새 비밀번호 확인</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-50 outline-none transition-all font-medium"
                    placeholder="다시 한번 입력"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowConfirm(true)}
                    onMouseUp={() => setShowConfirm(false)}
                    onMouseLeave={() => setShowConfirm(false)}
                    onTouchStart={() => setShowConfirm(true)}
                    onTouchEnd={() => setShowConfirm(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-600 transition-colors"
                  >
                    {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-3.5 rounded-2xl font-bold shadow-lg shadow-yellow-100 dark:shadow-none"
                >
                  {isLoading ? '변경 중...' : '변경하기'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
