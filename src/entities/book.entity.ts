import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Genre } from './genre.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'image', type: 'bytea', nullable: false })
  public image: Buffer;

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
