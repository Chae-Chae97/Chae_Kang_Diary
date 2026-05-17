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
import { AuthGuard } from '@nestjs/passport';

@Controller('diaries')
@UseGuards(AuthGuard('jwt')) // 모든 일기 관련 API는 로그인이 필요하도록 설정
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  async findAll(@Req() req) {
    return this.diariesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.diariesService.findOne(id, req.user.userId);
  }

  @Post()
  async create(@Body() createDiaryDto: CreateDiaryDto, @Req() req) {
    return this.diariesService.create(createDiaryDto, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiaryDto: Partial<CreateDiaryDto>,
    @Req() req,
  ) {
    return this.diariesService.update(id, updateDiaryDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.diariesService.remove(id, req.user.userId);
  }
}
