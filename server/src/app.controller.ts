import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto'; // ⭐ 추가!

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return '서버 엔진 가동 중!';
  }

  @Post('diary')
  async create(@Body() body: { title: string; content: string }) {
    return await this.appService.createDiary(body.title, body.content);
  }

  @Get('diary')
  async findAll() {
    return await this.appService.getAllDiaries();
  }

  // 3. 회원가입 입구 (업그레이드 완료! 🚀)
  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) { // ⭐ any 대신 DTO를 사용합니다.
    // 서비스로 상자(DTO)를 통째로 넘겨줍니다.
    return await this.appService.register(createUserDto);
  }
}