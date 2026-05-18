# 📔 일기장 프로젝트 API 협업 가이드 (API SPEC)

이 문서는 프론트엔드와 백엔드 간의 데이터 통신 규격을 정의합니다.

## 1. 기본 정보
- **Base URL:** `http://localhost:4000` (환경에 따라 변경 가능)
- **Content-Type:** `application/json`

---

## 2. API 엔드포인트

### 2.1 일기 목록 조회
메인 페이지에서 일기 카드 목록을 불러올 때 사용합니다.

- **URL:** `/diaries`
- **Method:** `GET`
- **Response Body:**
  ```json
  [
    {
      "id": 1,
      "title": "오늘의 제목",
      "content": "오늘의 내용...",
      "mood": "😊",
      "createdAt": "2026-05-11T00:00:00.000Z"
    },
    ...
  ]
  ```

### 2.2 새 일기 작성
작성 페이지에서 일기를 저장할 때 사용합니다.

- **URL:** `/diaries`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "string (required)",
    "content": "string (required)",
    "mood": "string (required, emoji)",
    "date": "string (required, ISO8601)"
  }
  ```
- **Response Body:**
  ```json
  {
    "id": 2,
    "title": "string",
    "content": "string",
    "mood": "string",
    "date": "string",
    "createdAt": "string"
  }
  ```

---

## 3. 데이터 타입 (TypeScript Interface)

프론트엔드에서 사용할 데이터 인터페이스 정의입니다.

```typescript
export interface Diary {
  id: number;
  title: string;
  content: string;
  mood: '😊' | '😎' | '😭' | '😡' | '😴';
  date: string;
  createdAt: string;
}

export interface CreateDiaryDto {
  title: string;
  content: string;
  mood: string;
  date: string;
}
```

---

## 4. 백엔드 담당자님께 드리는 요청사항
1. **CORS 설정:** 프론트엔드(`localhost:3000`)에서 접근 가능하도록 CORS를 허용해 주세요. (현재 NestJS `main.ts`에 `enableCors()` 반영됨)
2. **날짜 형식:** `createdAt`은 ISO 8601 형식을 선호합니다.
3. **감정(Mood) 데이터:** 프론트엔드에서 이모지(string)로 보내주시면 DB에 그대로 저장해 주시면 됩니다.
