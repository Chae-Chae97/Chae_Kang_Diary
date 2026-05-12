# 📔 My Diary Project - Agent Instructions

이 파일은 Gemini CLI 에이전트가 '일기장 프로젝트'의 맥락을 이해하고, 사용자와 동일한 방향성 및 코딩 스타일을 유지하며 협업하기 위한 가이드라인입니다.

## 🌟 프로젝트 비전 및 방향성
- **컨셉:** 깔끔하고 미니멀한 화이트 & 옐로우 톤의 따뜻하고 감성적인 일기장.
- **목표:** 사용자가 소중한 기록을 편하게 남기고 관리할 수 있는 서비스.
- **확장성:** 향후 사진 첨부, 음성 녹음 등 멀티미디어 기능 확장을 고려한 유연한 구조 설계.
- **플랫폼:** 우선적으로 **데스크탑 브라우저** 최적화에 집중.

## 👥 팀 구성 및 역할
- **사용자 (Frontend):** Next.js (App Router), React, Tailwind CSS 담당.
- **팀원 (Backend):** NestJS, Prisma 담당.
- **에이전트 (Gemini):** 사용자의 지시에 따라 프론트엔드 구현을 보조하고, 백엔드 인터페이스(API) 정합성을 체크하며 로직 및 UI 구성을 지원.

## 🛠 기술 스택 및 라이브러리 (Recommended)
### Frontend
- **Framework:** Next.js 15 (App Router)
- **State Management:** 
  - Server State: React Query (@tanstack/react-query)
  - Client State: Zustand (추천) 또는 Context API
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (추천)
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Framework:** NestJS 11
- **Database/ORM:** Prisma
- **Port:** Backend(4000), Frontend(3000)

## 🎨 코딩 컨벤션
- **컴포넌트 선언:** 일반 함수(`function ComponentName() {}`) 사용.
- **파일 네이밍:** **PascalCase.tsx** (예: `DiaryCard.tsx`, `WritePage.tsx`)
- **디렉토리 구조:** `client/src/components` 내부에 기능별 폴더(layout, ui, diary 등)로 세분화.
- **언어:** 코드는 영문 변수명을 사용하되, 주석과 사용자 노출 메시지는 **한글**을 기본으로 함.

## 🔄 협업 및 작업 규칙
- **Git 커밋 메시지:** Conventional Commits 규격 준수
  - `feat:`, `fix:`, `style:`, `refactor:`, `chore:`, `docs:`
- **에러 처리:** 
  - 일반적인 에러/성공 알림: Toast 팝업 사용 (예: sonner 또는 react-hot-toast)
  - 입력 폼 에러: 필드 하단 인라인 에러 메시지 노출
- **API 협업:** `API_SPEC.md`에 정의된 규격을 최우선으로 하며, 변경 필요 시 반드시 언급.

## 🚀 에이전트 작업 지침
1. **문서 우선:** 작업 전 항상 `GEMINI.md`와 `API_SPEC.md`를 읽고 맥락을 파악한다.
2. **품질 중심:** 성능 최적화보다는 **가독성**과 **유지보수성**이 좋은 코드를 제안한다.
3. **능동적 제안:** 사용자가 구현하려는 기능에 대해 더 나은 UI/UX나 효율적인 로직이 있다면 적극적으로 제안한다.
4. **검증:** 코드 작성 후, 해당 코드가 프로젝트의 기존 스타일 및 타입 시스템과 충돌하지 않는지 확인한다.

---
*최종 업데이트: 2026-05-12*
