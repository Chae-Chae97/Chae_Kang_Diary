// server/prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// .env 파일의 내용을 process.env에 로드합니다.
dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // 이제 process.env.DATABASE_URL을 정상적으로 인식합니다.
    url: process.env.DATABASE_URL,
  },
});