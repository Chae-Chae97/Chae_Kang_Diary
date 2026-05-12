import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { email, password, nickname } = createUserDto;

    // 1. 이미 가입된 이메일인지 확인
    const userExist = await this.userRepository.findOne({ where: { email } });
    if (userExist) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    // 2. 비밀번호 암호화 (Salt 10단계)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 프로필 및 유저 생성 (Cascade 설정 활용)
    const profile = new Profile();
    profile.nickname = nickname;

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      profile, // User 엔티티의 cascade: true 덕분에 프로필도 자동 저장됩니다.
    });

    await this.userRepository.save(user);
  }
}