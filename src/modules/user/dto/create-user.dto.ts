import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({ message: 'Not a valid email' })
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(8, { message: 'Minimum length is 8 symbols' })
  password: string;
}
