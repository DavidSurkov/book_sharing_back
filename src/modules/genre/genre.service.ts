import { Injectable } from '@nestjs/common';
import { Genre } from 'src/entities/genre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async createGenre(data: CreateGenreDto): Promise<Genre> {
    const newGenre = await this.genreRepository.create({ ...data });
    return await this.genreRepository.save(newGenre);
  }

  async getAll(): Promise<Genre[]> {
    return await this.genreRepository.createQueryBuilder('genre').getMany();
  }
}
