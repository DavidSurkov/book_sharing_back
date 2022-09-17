import { Module } from '@nestjs/common';
import { BookController } from 'src/modules/book/book.controller';
import { BookService } from 'src/modules/book/book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { PosterService } from 'src/files/poster/poster.service';
import { Poster } from 'src/files/poster/poster.entity';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/files/book/file.service';
import { File } from 'src/files/book/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Poster, File])],
  controllers: [BookController],
  providers: [BookService, PosterService, FileService, ConfigService],
})
export class BookModule {}
