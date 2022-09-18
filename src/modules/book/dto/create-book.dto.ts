import { IsNumber, IsString, IsUppercase } from 'class-validator';
import { Genre } from 'src/entities/genre.entity';
import { Transform } from 'class-transformer';
import { validateGenre } from 'src/utils/validate-genre';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString({ context: IsUppercase })
  @IsUppercase()
  author: string;

  @Transform(validateGenre, {
    toClassOnly: true,
  })
  genre: Genre[];

  @Transform((value) => +value.value)
  @IsNumber({ maxDecimalPlaces: 4 })
  year: number;

  @IsString()
  description: string;
}
