import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class SearchBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsNumberString()
  @IsOptional()
  year?: number;

  @IsNumberString()
  @IsOptional()
  genre?: number;
}
