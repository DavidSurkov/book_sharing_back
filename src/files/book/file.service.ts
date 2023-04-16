import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { File } from 'src/files/book/file.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(dataBuffer: Buffer, filename: string): Promise<File> {
    /*const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_POSTERS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${this.configService.get('AWS_BOOK_FOLDER')}/${uuid()}-${filename}`,
      })
      .promise();*/
    const newFilename = `${uuid()}-${filename}`;
    const filePath = `${this.configService.get('BOOK_DIRECTORY')}/${newFilename}`;
    await fs.promises.writeFile(filePath, dataBuffer);

    const newBook = this.fileRepository.create({
      key: newFilename,
      url: filePath,
    });
    await this.fileRepository.save(newBook);
    return newBook;
  }

  async deleteFile(fileId: number): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { id: fileId } });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_POSTERS_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.fileRepository.delete({ id: file.id });
  }
}
