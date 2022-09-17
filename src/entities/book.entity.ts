import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Genre } from 'src/entities/genre.entity';
import { Poster } from 'src/files/poster/poster.entity';
import { File } from 'src/files/book/file.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  public id: number;

  @JoinColumn()
  @OneToOne(() => Poster, { nullable: true, eager: true })
  public poster: Poster;

  @JoinColumn()
  @OneToOne(() => File, { nullable: true, eager: true })
  public file: File;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'varchar', length: 255 })
  public author: string;

  @Column()
  public year: number;

  @ManyToMany(() => Genre, (genre) => genre.books, { cascade: true, eager: true })
  @JoinTable()
  public genres: Genre[];

  @Column({ type: 'varchar', length: 255 })
  public description: string;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @ManyToOne(() => User, (user) => user.books)
  user: User;
}
