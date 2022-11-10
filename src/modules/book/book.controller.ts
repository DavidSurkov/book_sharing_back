import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthenticationGuard } from 'src/modules/auth/guard/jwt-authentication.guard';
import { BookService } from 'src/modules/book/book.service';
import { CreateBookDto } from 'src/modules/book/dto/create-book.dto';
import { RequestWithUser } from 'src/modules/auth/interface/request-with-user.interface';
import { Book } from 'src/entities/book.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { multerOptions } from 'src/files/config/multer.options';
import { ApiTags } from '@nestjs/swagger';
import { SearchBookDto } from './dto/search-book.dto';

@ApiTags('Book')
@Controller('book')
@UseInterceptors(ClassSerializerInterceptor)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'poster', maxCount: 1 },
        { name: 'book', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async createBook(
    @Body() book: CreateBookDto,
    @Req() req: RequestWithUser,
    @UploadedFiles() files: { poster: Express.Multer.File[]; book: Express.Multer.File[] },
  ): Promise<Book> {
    if (!files.poster && !files.book) {
      throw new HttpException('Files are not provided', HttpStatus.BAD_REQUEST);
    }
    return this.bookService.createBook(book, req.user, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.bookService.deleteBook(id);
  }

  @Get('all')
  @UseGuards(JwtAuthenticationGuard)
  async findAll() {
    return this.bookService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthenticationGuard)
  async searchBy(@Query() params: SearchBookDto): Promise<Book[]> {
    return this.bookService.searchBy(params);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return await this.bookService.findOne(id);
  }
}
