import { IsBase64, IsInt, IsString } from 'class-validator';

export class CreateBookDto {
  @IsBase64()
  image: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsInt()
  year: number;

  @IsString()
  description: string;
}
