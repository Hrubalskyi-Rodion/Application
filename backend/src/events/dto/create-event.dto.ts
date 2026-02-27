import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  description!: string;

  @IsDateString()
  date!: string;

  @IsNotEmpty()
  location!: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsEnum(['public', 'private'])
  visibility!: 'public' | 'private';
}
