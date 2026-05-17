import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, DiariesController],
  providers: [PrismaService, DiariesService],
})
export class AppModule {}
