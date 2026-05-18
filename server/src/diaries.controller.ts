import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { DiariesService } from './diaries.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './types';

@Controller('diaries')
@UseGuards(AuthGuard('jwt'))
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    return this.diariesService.findAll(req.user.id);
  }

  @Get('stats')
  async getStats(@Req() req: RequestWithUser) {
    return this.diariesService.getStats(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.diariesService.findOne(id, req.user.id);
  }

  @Post()
  async create(
    @Body() createDiaryDto: CreateDiaryDto,
    @Req() req: RequestWithUser,
  ) {
    // 🚀 로그를 통해 어떤 유저 ID가 실제로 저장되는지 백엔드 터미널에 확실히 남깁니다.
    console.log(
      `[Diary Create Request] User Email: ${req.user.email}, Extracted ID: ${req.user.id}`,
    );
    return this.diariesService.create(createDiaryDto, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaryDto: UpdateDiaryDto,
    @Req() req: RequestWithUser,
  ) {
    console.log(`[Diary Update Request] ID: ${id}, User: ${req.user.id}, Body:`, updateDiaryDto);
    try {
      const result = await this.diariesService.update(id, updateDiaryDto, req.user.id);
      console.log(`[Diary Update Success] ID: ${id}`);
      return result;
    } catch (error) {
      console.error(`[Diary Update Error] ID: ${id}, Error:`, error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.diariesService.remove(id, req.user.id);
  }
}
