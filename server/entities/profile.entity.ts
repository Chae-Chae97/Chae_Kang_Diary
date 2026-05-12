import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  bio: string; // 한 줄 소개

  @Column({ nullable: true })
  avatarUrl: string; // 프로필 이미지 경로

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn() // 외래키(FK)가 이 테이블에 생성됩니다.
  user: User;
}