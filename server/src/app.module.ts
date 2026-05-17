import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController, DiariesController],
  providers: [DiariesService],
})
export class AppModule {}
