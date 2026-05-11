import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from '../entities/diary.entity';
import { User } from '../entities/user.entity'; // ⭐ User 추가

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // ⭐ User 저장소 주입
  ) {}

  // --- 일기 관련 기능 ---
  async createDiary(title: string, content: string) {
    const newDiary = this.diaryRepository.create({ title, content });
    return await this.diaryRepository.save(newDiary);
  }

  async getAllDiaries() {
    return await this.diaryRepository.find();
  }

  // --- 회원 관련 기능 (신규!) ---
  async register(email: string, password: string, nickname: string) {
    const newUser = this.userRepository.create({ email, password, nickname });
    return await this.userRepository.save(newUser);
  }
}