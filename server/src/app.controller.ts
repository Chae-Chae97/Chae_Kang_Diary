import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 여기에 경로가 비어있어야 http://localhost:4000/diary 가 작동합니다!
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return '서버 엔진 가동 중!';
  }

  // 1. 일기 저장 입구 (POST /diary)
  @Post('diary')
  async create(@Body() body: { title: string; content: string }) {
    console.log('데이터가 들어왔어요!:', body); // 서버 터미널에 로그가 찍힐 거예요
    return await this.appService.createDiary(body.title, body.content);
  }

  // 2. 일기 목록 입구 (GET /diary)
  @Get('diary')
  async findAll() {
    return await this.appService.getAllDiaries();
  }

  // 3. 회원가입 입구 (POST /auth/register)
  @Post('auth/register')
  async register(@Body() body: any) {
    return await this.appService.register(body.email, body.password, body.nickname);
  }
}