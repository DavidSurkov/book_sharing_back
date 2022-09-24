import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';
import { User } from 'src/entities/user.entity';
import { PosterService } from 'src/files/poster/poster.service';
import { FileService } from 'src/files/book/file.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly posterService: PosterService,
    private readonly fileService: FileService,
  ) {}

  async createBook(
    data: CreateBookDto,
    user: User,
    files: { poster: Express.Multer.File[]; book: Express.Multer.File[] },
  ): Promise<Book> {
    const newPoster = await this.posterService.uploadPoster(files.poster[0].buffer, files.poster[0].originalname);
    const newFile = await this.fileService.uploadFile(files.book[0].buffer, files.book[0].originalname);
    if (newFile && newPoster) {
      const newBook = this.bookRepository.create({
        ...data,
        user,
        file: newFile,
        poster: newPoster,
      });
      await this.bookRepository.save(newBook);
      return newBook;
    }
    throw new HttpException('Flies are not saved', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async deleteBook(id: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    const fileId = book.file.id;
    const posterId = book.poster.id;
    if (book && fileId && posterId) {
      await this.bookRepository.delete({ id });
      await this.fileService.deleteFile(fileId);
      await this.posterService.deletePoster(posterId);
    } else {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genres', 'genre')
      .leftJoinAndSelect('book.file', 'file')
      .leftJoinAndSelect('book.poster', 'poster')
      .orderBy('book.title', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genres', 'genre')
      .leftJoinAndSelect('book.file', 'file')
      .leftJoinAndSelect('book.poster', 'poster')
      .leftJoinAndSelect('book.user', 'user')
      .where('book.id = :id', { id: id })
      .getOne();
    if (!book) {
      throw new HttpException(`Book with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return book;
  }
}
