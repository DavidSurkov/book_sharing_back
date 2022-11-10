import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Book } from './book.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ unique: true })
  public email: string;

  @ApiHideProperty()
  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  public password: string;

  @ApiHideProperty()
  @OneToMany(() => Book, (book) => book.user)
  books: Book[];
}
