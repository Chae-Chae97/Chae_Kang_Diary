import { Injectable, ConflictException } from '@nestjs/common'; // ⭐ ConflictException 추가
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from '../entities/diary.entity';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto'; // ⭐ 아까 만든 DTO 불러오기
import * as bcrypt from 'bcrypt'; // ⭐ 암호화 도구

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // --- 일기 관련 기능 (4단계에서 emoji 추가 예정!) ---
  async createDiary(title: string, content: string) {
    const newDiary = this.diaryRepository.create({ title, content });
    return await this.diaryRepository.save(newDiary);
  }

  async getAllDiaries() {
    return await this.diaryRepository.find();
  }

  // --- 회원가입 기능 (업그레이드 완료! 🚀) ---
  async register(dto: CreateUserDto) {
    const { email, password, nickname } = dto;

    // 1. 중복 가입 체크 (보안의 기본!)
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 2. 비밀번호 암호화 (강대장님의 소중한 정보를 외계어로!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 유저 + 프로필 동시 생성
    // Entity에서 cascade: true 설정을 했기 때문에 이렇게만 써도 Profile 테이블에 데이터가 들어갑니다.
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      profile: { nickname }, // 1:1 관계인 Profile 테이블에 닉네임 저장
    });

    await this.userRepository.save(newUser);
    
    return {
      message: '회원가입이 완료되었습니다!',
      user: { email: newUser.email, nickname: nickname }
    };
  }
}