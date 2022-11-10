import { IsArray, IsNumber, IsString } from 'class-validator';
import { Genre } from 'src/entities/genre.entity';
import { Transform } from 'class-transformer';
import { validateGenre } from 'src/utils/validate-genre';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @Transform(validateGenre)
  @IsArray()
  genres: Genre[];

  @Transform((value) => +value.value)
  @IsNumber({ maxDecimalPlaces: 4 })
  year: number;

  @IsString()
  description: string;
}
