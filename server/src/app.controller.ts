import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './types';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    await this.authService.signUp(createUserDto);
    return { success: true, message: '회원가입이 완료되었습니다.' };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    console.log(`[Auth Me] Request from user ID: ${req.user.id}`);
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(
    @Body('nickname') nickname: string,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.updateProfile(req.user.id, nickname);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('password')
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    await this.authService.changePassword(req.user.id, changePasswordDto);
    return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
