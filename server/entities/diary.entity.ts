import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity'; // ⭐ User를 불러와야 합니다.

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  // ⭐ 이 부분이 추가되어야 user.entity.ts의 빨간 줄이 사라집니다!
  // "여러 개의 일기는 한 명의 유저에게 속한다"는 뜻입니다.
  @ManyToOne(() => User, (user) => user.diaries)
  user: User;
}