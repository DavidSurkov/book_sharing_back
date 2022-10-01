import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { LocalAuthenticationGuard } from 'src/modules/auth/guard/local-authentication.guard';
import { RequestWithUser } from 'src/modules/auth/interface/request-with-user.interface';
import { JwtAuthenticationGuard } from 'src/modules/auth/guard/jwt-authentication.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/modules/user/users.service';
import { JwtRefreshGuard } from 'src/modules/auth/guard/jwt-refresh.guard';
import { User } from 'src/entities/user.entity';

@ApiTags('Authorization')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('register')
  async register(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser): Promise<User> {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser): Promise<void> {
    await this.usersService.removeRefreshToken(request.user.id);

    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('check')
  auth(@Req() request: RequestWithUser): User {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser): User {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
