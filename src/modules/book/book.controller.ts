import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/modules/auth/jwt-authentication.guard';
import { BookService } from 'src/modules/book/book.service';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';
import { RequestWithUser } from 'src/modules/auth/request-with-user.interface';
import { Book } from 'src/entities/book.entity';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createBook(@Body() book: CreateBookDto, @Req() req: RequestWithUser): Promise<Book> {
    return this.bookService.createBook(book, req.user);
  }
}
