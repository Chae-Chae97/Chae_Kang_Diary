import { IsString, IsEnum, IsISO8601, IsOptional, IsBoolean } from 'class-validator';
import { Mood } from './create-diary.dto';

export class UpdateDiaryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(Mood, { message: '허용되지 않은 감정(이모지)입니다.' })
  mood?: string;

  @IsOptional()
  @IsISO8601({}, { message: '유효한 날짜 형식(ISO8601)이어야 합니다.' })
  date?: string;

  @IsOptional()
  @IsBoolean()
  isSpecial?: boolean;
}
