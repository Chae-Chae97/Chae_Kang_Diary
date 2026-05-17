import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';

export enum Mood {
  HAPPY = '😊',
  COOL = '😎',
  SAD = '😭',
  ANGRY = '😡',
  SLEEPY = '😴',
}

export class CreateDiaryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(Mood, { message: '허용되지 않은 감정(이모지)입니다.' })
  mood: string;

  @IsNotEmpty({ message: '일기 날짜는 필수입니다.' })
  @IsDateString({}, { message: '올바른 날짜 형식이 아닙니다.' })
  date: string;
}

