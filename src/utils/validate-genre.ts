import { isArray, isNumber, isString } from 'class-validator';
import { plainToInstance, TransformFnParams } from 'class-transformer';
import { Genre } from 'src/entities/genre.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export const validateGenre = (object: TransformFnParams) => {
  if (isArray(object.value)) {
    return object.value.map((genre: string) => {
      const genres = plainToInstance(Genre, JSON.parse(genre));
      if (isNumber(genres.id) && isString(genres.name)) {
        return genres;
      }
      throw new HttpException('Genre is not an instance of Genre class', HttpStatus.BAD_REQUEST);
    });
  }
  throw new HttpException('Genre is not array', HttpStatus.BAD_REQUEST);
};
