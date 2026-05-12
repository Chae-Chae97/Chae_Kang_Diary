"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { BookOpen } from "lucide-react";

interface Diary {
  id: number;
  title: string;
  preview: string;
  mood: string;
  date: string;
}

interface DiaryListProps {
  selectedDate: Date;
  diaries: Diary[];
  onDiaryClick: (diary: Diary) => void;
}

export function DiaryList({ selectedDate, diaries, onDiaryClick }: DiaryListProps) {
  const formattedDate = format(selectedDate, "yyyy년 MM월 dd일", { locale: ko });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-yellow-500" />
          {formattedDate}의 일기
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          총 {diaries.length}건
        </span>
      </div>

      {diaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">이날 작성한 일기가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {diaries.map((diary) => (
            <div 
              key={diary.id}
              onClick={() => onDiaryClick(diary)}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{diary.title}</h3>
                <span className="text-2xl">{diary.mood}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {diary.preview}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
