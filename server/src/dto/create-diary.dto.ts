import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

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
}
