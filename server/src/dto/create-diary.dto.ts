import { IsNotEmpty, IsString, IsEnum, IsISO8601 } from 'class-validator';

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
  title!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsEnum(Mood, { message: '허용되지 않은 감정(이모지)입니다.' })
  mood!: string;

  @IsNotEmpty()
  @IsISO8601({}, { message: '유효한 날짜 형식(ISO8601)이어야 합니다.' })
  date!: string;
}
