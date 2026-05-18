import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiariesService {
  constructor(private prisma: PrismaService) {}

  // 내 일기 목록 조회 (일기 날짜 기준 정렬)
  async findAll(userId: number) {
    return this.prisma.diary.findMany({
      where: { userId },
      orderBy: {
        date: 'desc',
      },
    });
  }

  // 일기 상세 조회 (소유권 확인 포함)
  async findOne(id: number, userId: number) {
    const diary = await this.prisma.diary.findUnique({
      where: { id },
    });

    if (!diary) {
      throw new NotFoundException(`해당 ID(${id})의 일기를 찾을 수 없습니다.`);
    }

    if (diary.userId !== userId) {
      throw new ForbiddenException('이 일기에 접근할 권한이 없습니다.');
    }

    return diary;
  }

  // 일기 생성
  async create(createDiaryDto: CreateDiaryDto, userId: number) {
    const { title, content, mood, date, isSpecial } = createDiaryDto;

    return this.prisma.diary.create({
      data: {
        title,
        content,
        mood,
        userId,
        date: new Date(date),
        isSpecial: isSpecial || false,
      },
    });
  }

  // 일기 수정 (소유권 확인 포함)
  async update(
    id: number,
    updateDiaryDto: UpdateDiaryDto,
    userId: number,
  ) {
    await this.findOne(id, userId); // 존재 여부 및 소유권 확인

    const { title, content, mood, date, isSpecial } = updateDiaryDto;

    return this.prisma.diary.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(mood && { mood }),
        ...(isSpecial !== undefined && { isSpecial }),
        ...(date && { date: new Date(date) }),
      },
    });
  }

  // 일기 삭제 (소유권 확인 포함)
  async remove(id: number, userId: number) {
    await this.findOne(id, userId); // 존재 여부 및 소유권 확인

    await this.prisma.diary.delete({
      where: { id },
    });

    return { success: true, message: '일기가 삭제되었습니다.' };
  }

  // 통계 데이터 가져오기
  async getStats(userId: number) {
    // 1. 총 일기 개수
    const totalCount = await this.prisma.diary.count({
      where: { userId },
    });

    // 2. 감정별 분포 (Group By)
    const moodDistribution = await this.prisma.diary.groupBy({
      by: ['mood'],
      where: { userId },
      _count: {
        mood: true,
      },
    });

    // 3. 최근 7일간의 추이
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentDiaries = await this.prisma.diary.findMany({
      where: {
        userId,
        date: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        date: true,
        mood: true,
      },
    });

    return {
      totalCount,
      moodDistribution: moodDistribution.map((item) => ({
        mood: item.mood,
        count: item._count.mood,
      })),
      recentTrend: recentDiaries.map((diary) => ({
        date: diary.date,
        mood: diary.mood,
      })),
      currentStreak: await this.calculateStreak(userId),
    };
  }

  // 연속 작성일(Streak) 계산 로직
  private async calculateStreak(userId: number) {
    const diaries = await this.prisma.diary.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' },
    });

    if (diaries.length === 0) return 0;

    // 중복 날짜 제거 및 시간 정보 제거 (날짜만 비교)
    const uniqueDates = Array.from(
      new Set(
        diaries.map((d) => new Date(d.date).toISOString().split('T')[0]),
      ),
    ).map((dateStr) => new Date(dateStr));

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 가장 최근 일기가 오늘이나 어제여야 스트릭 유지
    const lastEntryDate = new Date(uniqueDates[0]);
    lastEntryDate.setHours(0, 0, 0, 0);

    if (
      lastEntryDate.getTime() !== today.getTime() &&
      lastEntryDate.getTime() !== yesterday.getTime()
    ) {
      return 0;
    }

    // 연속된 날짜 확인
    let currentDate = lastEntryDate;
    for (let i = 0; i < uniqueDates.length; i++) {
      const entryDate = new Date(uniqueDates[i]);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
