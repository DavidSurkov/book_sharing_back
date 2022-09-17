import { IsArray, IsNumber, IsString } from 'class-validator';
import { Genre } from 'src/entities/genre.entity';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @Transform((object) => object.value.map((genre: string) => JSON.parse(genre)), { toClassOnly: true })
  @IsArray()
  genre: Genre[];

  @Transform((value) => +value.value, { toClassOnly: true })
  @IsNumber()
  year: number;

  @IsString()
  description: string;
}
