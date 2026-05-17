"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// react-day-picker의 기본 스타일을 위해 필요합니다.
import "react-day-picker/dist/style.css";

interface DiaryCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  diaryDates: string[]; // 일기가 있는 날짜들 (ISO string 또는 YYYY-MM-DD)
}

export function DiaryCalendar({ selectedDate, onDateSelect, diaryDates }: DiaryCalendarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 overflow-hidden relative paper-texture"
    >
      <div className="flex items-center gap-2 mb-6 text-yellow-600 dark:text-yellow-400 font-bold">
        <CalendarIcon className="w-5 h-5" />
        <span>Calendar</span>
      </div>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        locale={ko}
        modifiers={{
          hasDiary: diaryDates.map(date => new Date(date)),
        }}
        modifiersClassNames={{
          hasDiary: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-yellow-500 dark:after:bg-yellow-400 after:rounded-full after:shadow-sm",
        }}
        classNames={{
          months: "w-full",
          month: "w-full space-y-6",
          month_caption: "flex justify-center pt-2 relative items-center mb-8",
          caption_label: "text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight",
          nav: "flex items-center",
          button_previous: "absolute left-0 h-10 w-10 bg-transparent p-0 opacity-60 hover:opacity-100 transition-all !text-yellow-600 dark:!text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-full flex items-center justify-center",
          button_next: "absolute right-0 h-10 w-10 bg-transparent p-0 opacity-60 hover:opacity-100 transition-all !text-yellow-600 dark:!text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-full flex items-center justify-center",
          month_grid: "w-full border-collapse",
          weekdays: "flex w-full justify-between mb-4",
          weekday: "text-gray-400 rounded-md w-10 font-bold text-[0.75rem] dark:text-gray-500 uppercase tracking-widest text-center flex items-center justify-center",
          weeks: "w-full space-y-2",
          week: "flex w-full mt-2 justify-between",
          day: cn(
            "h-10 w-10 p-0 font-semibold aria-selected:opacity-100 hover:!bg-yellow-50 dark:hover:!bg-yellow-900/40 rounded-2xl transition-all dark:text-gray-300 active:scale-90 flex items-center justify-center relative"
          ),
          selected:
            "!bg-yellow-400 !text-black shadow-lg shadow-yellow-200 dark:shadow-none hover:!bg-yellow-500 dark:!bg-yellow-500 dark:!text-black focus:!bg-yellow-400",
          today: "!bg-gray-100 !text-gray-900 dark:!bg-gray-700 dark:!text-yellow-300 font-black ring-2 ring-yellow-200 dark:ring-yellow-900/50",
          outside: "text-gray-300 opacity-20 dark:text-gray-600",
          disabled: "text-gray-300 opacity-20 dark:text-gray-600",
          hidden: "invisible",
        }}
        components={{
          Chevron: (props) => {
            if (props.orientation === "left") {
              return <ChevronLeft className="h-6 w-6" />;
            }
            return <ChevronRight className="h-6 w-6" />;
          },
        }}
      />
      
      <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-center">
        <button 
          onClick={() => onDateSelect(new Date())}
          className="px-4 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-[0.7rem] font-bold text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors uppercase tracking-widest"
        >
          Go Today
        </button>
      </div>
    </motion.div>
  );
}
