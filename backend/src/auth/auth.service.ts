import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async loginWithCredentials(userDto: { username: string; password: string }) {
    const { username, password } = userDto;
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const userData = await this.usersService.findOne(user._id);

    const payload = { username: user.username, sub: user._id };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      userData,
    };
  }

  async register(userDto: any) {
    const existingUser = await this.usersService.findByUsername(userDto.username);
    const existingEmail = await this.usersService.findByEmail(userDto.email);

    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    if (existingEmail) {
      throw new BadRequestException('Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });

    return {
      message: 'Registration successful',
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    };
  }
}
