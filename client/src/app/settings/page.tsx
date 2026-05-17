'use client';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Language, translations } from '@/constants/globalMessages';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { lang, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    toast.success(translations[newLang].save_success);
  };


  return (
    <main className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-10 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight text-center">
        ⚙️ {t.settings_title}
      </h1>

      <div className="space-y-10">
        {/* 언어 설정 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1 text-gray-700 dark:text-gray-300">
            <span className="text-xl">🌐</span>
            <label className="font-bold">{t.settings_language}</label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(['ko', 'en', 'jp'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`py-3 rounded-2xl font-bold transition-all ${
                  lang === l
                    ? 'bg-yellow-400 text-black shadow-lg scale-105'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {l === 'ko' ? '한국어' : l === 'en' ? 'English' : '日本語'}
              </button>
            ))}
          </div>
        </section>

        {/* 테마 설정 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 ml-1 text-gray-700 dark:text-gray-300">
            <span className="text-xl">🌓</span>
            <label className="font-bold">{t.settings_theme}</label>
          </div>
          <div 
            onClick={toggleTheme}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
          >
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {isDarkMode ? t.theme_dark : t.theme_light}
            </span>
            <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-yellow-400' : 'bg-gray-300'}`}>
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : ''}`} />
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-center text-gray-400 text-sm">
          Version 1.0.0
        </div>
      </div>
    </main>
  );
}
