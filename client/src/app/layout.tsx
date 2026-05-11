import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex">
        <Sidebar />
        
        {/* 사이드바 너비(ml-64)를 고려한 메인 영역 */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Header />
          
          {/* 콘텐츠 영역이 가변적으로 늘어나도록 flex-1 설정 */}
          <main className="flex-1 bg-gray-50 p-8">
            {children}
          </main>
          
          <Footer />
        </div>
      </body>
    </html>
  );
}