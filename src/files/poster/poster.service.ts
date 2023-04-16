import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Poster } from 'src/files/poster/poster.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class PosterService {
  constructor(
    @InjectRepository(Poster)
    private posterRepository: Repository<Poster>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPoster(dataBuffer: Buffer, filename: string): Promise<Poster> {
    /*const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_POSTERS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${this.configService.get('AWS_POSTER_FOLDER')}/${uuid()}-${filename}`,
      })
      .promise();*/
    const newFilename = `${uuid()}-${filename}`;
    const filePath = `${this.configService.get('POSTER_DIRECTORY')}/${newFilename}`;
    await fs.promises.writeFile(filePath, dataBuffer);

    const newPoster = this.posterRepository.create({
      key: newFilename,
      url: filePath,
    });
    await this.posterRepository.save(newPoster);
    return newPoster;
  }

  async findById(id: number) {
    const poster = await this.posterRepository.findOne({ where: { id } });
    return fs.createReadStream(poster.url);
  }

  async deletePoster(posterId: number): Promise<void> {
    const file = await this.posterRepository.findOne({ where: { id: posterId } });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_POSTERS_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.posterRepository.delete(file.id);
  }
}
