import { IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsEnum(['public', 'private'])
  visibility?: 'public' | 'private';
}
