import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 155 })
  public name: string;

  @ApiHideProperty()
  @ManyToMany(() => Book, (book) => book.genres)
  public books?: Book[];
}
