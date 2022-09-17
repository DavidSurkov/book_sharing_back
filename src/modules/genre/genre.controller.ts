import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenreService } from 'src/modules/genre/genre.service';
import { CreateGenreDto } from 'src/modules/genre/dto/create-genre.dto';
import { Genre } from 'src/entities/genre.entity';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async createGenre(@Body() data: CreateGenreDto): Promise<Genre> {
    return await this.genreService.createGenre(data);
  }

  @Get('all')
  async getAll(): Promise<Genre[]> {
    return await this.genreService.getAll();
  }
}
