import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Diary } from './diary.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 중복 가입 방지
  email: string;

  @Column()
  password: string; // 실제로는 암호화해서 저장해야 합니다!

  @Column({ nullable: true })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  // ⭐ 관계 설정: 한 명의 유저는 여러 개의 일기를 가질 수 있습니다 (1:N)
  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];
}