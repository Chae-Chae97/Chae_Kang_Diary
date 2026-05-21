# 📔 일기장 프로젝트 API 협업 가이드 (API SPEC)

이 문서는 프론트엔드와 백엔드 간의 데이터 통신 규격을 정의합니다. 모든 요청에는 JWT 토큰이 필요합니다 (로그인/회원가입 제외).

## 1. 기본 정보
- **Base URL:** `http://localhost:4000`
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <token>`

---

## 2. API 엔드포인트

### 2.1 인증 (Auth)

#### 회원가입
- **URL:** `/auth/signup`
- **Method:** `POST`
- **Body:** `{ "email": "string", "password": "string", "nickname": "string" }`

#### 로그인
- **URL:** `/auth/login`
- **Method:** `POST`
- **Response:** `{ "accessToken": "string" }`

#### 내 정보 조회
- **URL:** `/auth/me`
- **Method:** `GET`

### 2.2 일기 (Diaries)

#### 일기 목록 조회
- **URL:** `/diaries`
- **Method:** `GET`
- **Response:** `Diary[]`

#### 일기 상세 조회
- **URL:** `/diaries/:id`
- **Method:** `GET`

#### 새 일기 작성
- **URL:** `/diaries`
- **Method:** `POST`
- **Body:** `{ "title": "string", "content": "string", "mood": "emoji", "date": "ISO8601", "isSpecial": boolean }`

#### 일기 수정
- **URL:** `/diaries/:id`
- **Method:** `PATCH`

#### 일기 삭제
- **URL:** `/diaries/:id`
- **Method:** `DELETE`

### 2.3 통계 (Stats)

#### 통계 데이터 조회
- **URL:** `/diaries/stats`
- **Method:** `GET`
- **Response Body:**
  ```json
  {
    "totalCount": 10,
    "moodDistribution": [
      { "mood": "😊", "count": 5 },
      ...
    ],
    "recentTrend": [
      { "date": "2026-05-18T...", "mood": "😊" },
      ...
    ]
  }
  ```

---

## 3. 데이터 타입 (TypeScript Interface)

```typescript
export interface Diary {
  id: number;
  title: string;
  content: string;
  mood: '😊' | '😎' | '😭' | '😡' | '😴';
  date: string;
  isSpecial: boolean;
  createdAt: string;
}

export interface StatsResponse {
  totalCount: number;
  moodDistribution: { mood: string; count: number }[];
  recentTrend: { date: string; mood: string }[];
}
```
