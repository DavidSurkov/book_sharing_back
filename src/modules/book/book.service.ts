import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async createBook(data: CreateBookDto, user: User): Promise<Book> {
    const image = Buffer.from(data.image, 'base64');
    const newBook = await this.bookRepository.create({ ...data, image, user });
    await this.bookRepository.save(newBook);
    return newBook;
  }
}
