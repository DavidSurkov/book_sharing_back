import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenreService } from 'src/modules/genre/genre.service';
import { CreateGenreDto } from 'src/modules/genre/dto/create-genre.dto';
import { Genre } from 'src/entities/genre.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Genre')
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('private')
  @ApiCreatedResponse({ type: Genre })
  async createGenre(@Body() data: CreateGenreDto): Promise<Genre> {
    return await this.genreService.createGenre(data);
  }

  @Get('all')
  @ApiOkResponse({ type: [Genre] })
  async getAll(): Promise<Genre[]> {
    return await this.genreService.getAll();
  }
}
