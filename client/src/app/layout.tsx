'use client';

import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";
import { useEffect } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await api.get('/auth/me');
        const userData = response.data;
        
        setAuth({
          id: userData.id,
          email: userData.email,
          nickname: userData.profile?.nickname || userData.name || '사용자',
        });
      } catch (error) {
        console.error('인증 확인 실패:', error);
        localStorage.removeItem('accessToken');
        setAuth(null);
      }
    };

    checkAuth();
  }, [setAuth]);

  return (
    <html lang="ko">
      <body className="flex">
        <ThemeProvider>
          <LanguageProvider>
            <Toaster richColors position="top-right" />
            <Sidebar />
            
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
              <Header />
              
              <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
                {children}
              </main>
              
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
