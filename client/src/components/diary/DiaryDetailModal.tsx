"use client";

import { X, Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Diary {
  id: number;
  title: string;
  preview: string;
  content?: string; // 상세 내용은 content에 들어있다고 가정
  mood: string;
  date: string;
}

interface DiaryDetailModalProps {
  diary: Diary | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export function DiaryDetailModal({ diary, isOpen, onClose, onDelete, onEdit }: DiaryDetailModalProps) {
  if (!isOpen || !diary) return null;

  // 모달 바깥 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const formattedDate = format(new Date(diary.date), "yyyy년 MM월 dd일 (EEEE)", { locale: ko });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* 모달 헤더: 감정 및 닫기 버튼 */}
        <div className="relative h-32 bg-yellow-400 dark:bg-yellow-500/20 flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white dark:text-gray-300" />
          </button>
          <div className="text-6xl bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg translate-y-8">
            {diary.mood}
          </div>
        </div>

        {/* 모달 바디: 내용 */}
        <div className="pt-12 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {diary.title}
            </h2>
          </div>

          <div className="min-h-[150px] py-4 border-t border-b border-gray-50 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {diary.content || diary.preview}
              {/* 실제 데이터가 오면 diary.content를 보여줍니다. */}
            </p>
          </div>

          {/* 모달 푸터: 액션 버튼 */}
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => onEdit(diary.id)}
              className="flex-1 gap-2 rounded-2xl py-3 border-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold"
            >
              <Edit2 className="w-4 h-4" />
              수정하기
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                if(confirm("정말로 이 일기를 삭제할까요?")) onDelete(diary.id);
              }}
              className="flex-1 gap-2 rounded-2xl py-3 shadow-lg shadow-red-100 dark:shadow-none font-bold"
            >
              <Trash2 className="w-4 h-4" />
              삭제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
