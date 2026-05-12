import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, CreateDateColumn } from 'typeorm';
import { Diary } from './diary.entity';
import { Profile } from './profile.entity'; // ⭐ 추가될 엔티티

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @CreateDateColumn()
  createdAt: Date;

  // ⭐ 관계 설정: 유저 한 명은 하나의 프로필만 가집니다 (1:1)
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  // ⭐ 관계 설정: 한 명의 유저는 여러 개의 일기를 가질 수 있습니다 (1:N)
  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];
}