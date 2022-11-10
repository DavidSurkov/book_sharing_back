import { Module } from '@nestjs/common';
import { GenreController } from 'src/modules/genre/genre.controller';
import { GenreService } from 'src/modules/genre/genre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/entities/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
