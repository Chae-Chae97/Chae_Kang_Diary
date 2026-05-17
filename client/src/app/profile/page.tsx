'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { User, Mail, Calendar, Camera, ShieldCheck, BookHeart, PencilLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { PasswordChangeModal } from '@/components/profile/PasswordChangeModal';

export default function ProfilePage() {
  // 임시 사용자 데이터 (나중에 백엔드 API에서 가져올 데이터)
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinedAt: '2026-05-01',
    totalDiaries: 12,
    favoriteMood: '😎',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editName, setEditName] = useState(userInfo.name);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfo(prev => ({ ...prev, name: editName }));
    setIsEditing(false);
    alert('프로필 정보가 수정되었습니다.');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* 좌측: 프로필 카드 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 left-0 w-full h-24 bg-yellow-400 opacity-10" />
            
            <div className="relative pt-4">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold text-black border-4 border-white dark:border-gray-800 shadow-lg mx-auto">
                  {userInfo.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-100 dark:border-gray-600 hover:bg-yellow-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-4">{userInfo.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{userInfo.email}</p>
              
              <div className="flex items-center justify-center gap-2 mt-6 py-2 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-full inline-flex">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">가입일: {userInfo.joinedAt}</span>
              </div>
            </div>
          </div>

          {/* 활동 요약 카드 */}
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">나의 활동 요약</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                <div className="flex items-center gap-3">
                  <BookHeart className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">작성한 일기</span>
                </div>
                <span className="text-xl font-black text-yellow-700 dark:text-yellow-400">{userInfo.totalDiaries}개</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{userInfo.favoriteMood}</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">주로 느끼는 감정</span>
                </div>
                <span className="text-sm font-black text-blue-700 dark:text-blue-400">행복함</span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 상세 정보 및 수정 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400 rounded-xl">
                  <User className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">상세 프로필 설정</h3>
              </div>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full gap-2 border border-gray-100 dark:border-gray-700"
                >
                  <PencilLine className="w-4 h-4" />
                  정보 수정
                </Button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">이름</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-50 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-bold text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">이메일 계정</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email"
                      disabled
                      value={userInfo.email}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl opacity-70 cursor-not-allowed font-bold text-gray-800 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 ml-1 italic">* 이메일은 변경할 수 없습니다.</p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-600">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">계정 보안</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">소중한 개인정보 보호를 위해 정기적으로 비밀번호를 변경해 주세요.</p>
                    <button 
                      type="button" 
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="text-sm text-yellow-600 dark:text-yellow-400 font-bold mt-3 hover:underline"
                    >
                      비밀번호 변경하기 →
                    </button>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(userInfo.name);
                    }}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                  <Button 
                    type="submit"
                    className="flex-[2] py-4 rounded-2xl text-lg font-bold shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20 transition-transform hover:scale-[1.02]"
                  >
                    저장하기
                  </Button>
                </div>
              )}
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-bold text-red-400 mb-4 ml-1">위험 구역</h4>
              <button className="px-6 py-3 border border-red-100 dark:border-red-900/30 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                회원 탈퇴하기
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <PasswordChangeModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
