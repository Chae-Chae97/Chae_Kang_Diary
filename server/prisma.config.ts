// server/prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// .env 파일의 최신 내용을 process.env에 확실하게 로드합니다.
dotenv.config();

// 복잡한 백틱 조립 오타를 원천 차단하고, .env의 완벽한 주소를 그대로 가져다 씁니다!
// DATABASE_URL이 없을 경우를 대비한 대체 로직을 포함합니다.
const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
const databaseUrl = process.env.DATABASE_URL || `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
