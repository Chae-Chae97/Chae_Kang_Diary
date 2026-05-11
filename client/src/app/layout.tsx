import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex">
        <ThemeProvider>
          <LanguageProvider>
            <Sidebar />
            
            {/* 사이드바 너비(ml-64)를 고려한 메인 영역 */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
              <Header />
              
              {/* 콘텐츠 영역이 가변적으로 늘어나도록 flex-1 설정 */}
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