"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// react-day-picker의 기본 스타일을 위해 필요합니다.
// 실제 프로젝트에서는 globals.css에 추가하거나 커스텀 스타일링을 적용합니다.
import "react-day-picker/dist/style.css";

interface DiaryCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  diaryDates: string[]; // 일기가 있는 날짜들 (ISO string 또는 YYYY-MM-DD)
}

export function DiaryCalendar({ selectedDate, onDateSelect, diaryDates }: DiaryCalendarProps) {
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        locale={ko}
        modifiers={{
          hasDiary: diaryDates.map(date => new Date(date)),
        }}
        modifiersClassNames={{
          hasDiary: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-yellow-500 dark:after:bg-yellow-400 after:rounded-full",
        }}
        classNames={{
          months: "w-full",
          month: "w-full space-y-4",
          caption: "flex justify-center pt-1 relative items-center mb-2",
          caption_label: "text-base font-bold text-gray-900 dark:text-gray-100",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity !text-yellow-600 dark:!text-yellow-400"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-between",
          head_cell: "text-gray-400 rounded-md w-9 font-medium text-[0.75rem] dark:text-gray-500 uppercase",
          row: "flex w-full mt-2 justify-between",
          cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:!bg-yellow-50 dark:hover:!bg-yellow-900/40 rounded-full transition-colors dark:text-gray-300"
          ),
          day_selected:
            "!bg-yellow-400 !text-black hover:!bg-yellow-500 dark:!bg-yellow-500 dark:!text-black focus:!bg-yellow-400",
          day_today: "!bg-yellow-50 !text-yellow-700 dark:!bg-gray-700 dark:!text-yellow-300 font-bold ring-1 ring-yellow-200 dark:ring-yellow-900/50",
          day_outside: "text-gray-300 opacity-30 dark:text-gray-600",
          day_disabled: "text-gray-300 opacity-30 dark:text-gray-600",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: ({ ...props }) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-600 dark:text-yellow-400">
              <polygon points="16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20"></polygon>
            </svg>
          ),
          IconRight: ({ ...props }) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-600 dark:text-yellow-400 rotate-180">
              <polygon points="16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20"></polygon>
            </svg>
          ),
        }}
      />
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => onDateSelect(new Date())}
          className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
        >
          오늘 날짜로 이동
        </button>
      </div>
    </div>
  );
}
