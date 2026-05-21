'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { BookHeart, TrendingUp, PieChart as PieChartIcon, Calendar } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const MOOD_COLORS: Record<string, string> = {
  '😊': '#FACC15', // yellow-400
  '😎': '#60A5FA', // blue-400
  '😭': '#94A3B8', // slate-400
  '😡': '#F87171', // red-400
  '😴': '#A78BFA', // violet-400
};

const MOOD_SCORES: Record<string, number> = {
  '😊': 5,
  '😎': 4,
  '😴': 3,
  '😭': 2,
  '😡': 1
};

interface StatsData {
  totalCount: number;
  moodDistribution: { mood: string; count: number }[];
  recentTrend: { date: string; mood: string }[];
}

export default function StatsPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/diaries/stats');
        setData(response.data);
      } catch (err) {
        console.error('통계 데이터 로드 실패:', err);
        toast.error(t.load_fail);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [t.load_fail]);

  const moodStats = useMemo(() => {
    if (!data) return { pieData: [], mostCommon: 'N/A', total: 0 };

    const pieData = data.moodDistribution.map(item => ({
      name: item.mood,
      value: item.count,
      color: MOOD_COLORS[item.mood] || '#CBD5E1'
    }));

    const sortedMoods = [...data.moodDistribution].sort((a, b) => b.count - a.count);
    const mostCommon = sortedMoods[0]?.mood || 'N/A';

    return { pieData, mostCommon, total: data.totalCount };
  }, [data]);

  const trendData = useMemo(() => {
    if (!data) return [];
    return data.recentTrend.map(d => {
      const dateObj = new Date(d.date);
      return {
        date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
        score: MOOD_SCORES[d.mood] || 3,
        mood: d.mood
      };
    });
  }, [data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">{t.stats_analyzing}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-100 dark:shadow-none">
            <PieChartIcon className="w-6 h-6 text-black" />
          </div>
          {t.stats_title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
          {t.stats_desc}
        </p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* 요약 카드 1 */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-700 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.stats_total_records}</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">{moodStats.total}<span className="text-lg ml-1">{t.stats_unit_count}</span></h2>
        </motion.div>

        {/* 요약 카드 2 */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-700 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <BookHeart className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.stats_most_common}</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">{moodStats.mostCommon}</h2>
        </motion.div>

        {/* 요약 카드 3 */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-700 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.stats_mood_trend}</p>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            {trendData.length > 1 ? (trendData[trendData.length-1].score >= trendData[trendData.length-2].score ? 'Stable' : 'Volatile') : 'Initial'}
          </h2>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 파이 차트 */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 ml-2 flex items-center gap-2">
            <div className="w-2 h-6 bg-yellow-400 rounded-full" />
            {t.stats_mood_distribution}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodStats.pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {moodStats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 라인 차트 */}
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 ml-2 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-400 rounded-full" />
            {t.stats_mood_trend}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94A3B8' }} 
                  dy={10}
                />
                <YAxis hide domain={[0, 6]} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl shadow-xl border border-gray-50 dark:border-gray-600">
                          <p className="text-xl">{payload[0].payload.mood}</p>
                          <p className="text-xs font-bold text-gray-400 mt-1">{payload[0].payload.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#FACC15" 
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
