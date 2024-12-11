import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkAuth(@Req() req) {
    const userId = req.user.sub;
    const user = await this.usersService.findOne(userId);
    return { username: req.user.username, id: req.user.sub, user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
