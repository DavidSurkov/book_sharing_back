import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 155 })
  public name: string;

  @ManyToMany(() => Book, (book) => book.genres)
  public books: Book[];
}
