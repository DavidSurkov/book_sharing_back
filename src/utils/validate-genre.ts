import { isArray, isNumber, isString } from 'class-validator';
import { plainToInstance, TransformFnParams } from 'class-transformer';
import { Genre } from 'src/entities/genre.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export const validateGenre = (object: TransformFnParams) => {
  if (isArray(object.value)) {
    return object.value.map((genre: string) => {
      if (typeof genre === 'string') {
        const genreInstance = plainToInstance(Genre, JSON.parse(genre));
        if (isNumber(genreInstance.id) && isString(genreInstance.name)) {
          return genreInstance;
        }
        throw new HttpException('Genre is not an instance of Genre class', HttpStatus.BAD_REQUEST);
      }
      return genre;
    });
  }
  throw new HttpException('Genre is not array', HttpStatus.BAD_REQUEST);
};
