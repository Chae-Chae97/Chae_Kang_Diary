import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateDiaryDto } from './dto/create-diary.dto';

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
    const { title, content, mood, date } = createDiaryDto;

    return this.prisma.diary.create({
      data: {
        title,
        content,
        mood,
        userId,
        date: new Date(date),
      },
    });
  }

  // 일기 수정 (소유권 확인 포함)
  async update(
    id: number,
    updateDiaryDto: Partial<CreateDiaryDto>,
    userId: number,
  ) {
    await this.findOne(id, userId); // 존재 여부 및 소유권 확인

    const { date, ...rest } = updateDiaryDto;

    return this.prisma.diary.update({
      where: { id },
      data: {
        ...rest,
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
}
