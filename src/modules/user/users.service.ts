import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { hash, compare } from 'bcrypt';

const SALT = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create({ ...userData });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken(token: string, userId: number): Promise<void> {
    const currentHashedRefreshToken = await hash(token, SALT);
    await this.userRepository.update({ id: userId }, { currentHashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
    const user = await this.getById(userId);

    const isRefreshTokenMarching = await compare(refreshToken, user.currentHashedRefreshToken);

    if (!isRefreshTokenMarching) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async removeRefreshToken(userId: number): Promise<UpdateResult> {
    return this.userRepository.update({ id: userId }, { currentHashedRefreshToken: null });
  }
}
