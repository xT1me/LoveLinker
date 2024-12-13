import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateAccessToken(payload: any, token: string): Promise<boolean> {
    return true;
  }

  async login(user: any) {
    const payload = { userId: user._id, roles: user.roles };
    
    const accessTokenDev = this.jwtService.sign(payload, {
      secret: 'dL8oS1+WZ/pLvEYeMkmO4Z3HYQWhYZ88n2vqQfr2aFB=',
      expiresIn: '1h',
    });
  
    const refreshTokenDev = this.jwtService.sign(payload, {
      secret: 'dL8oS1+WZ/pLvEYeMkmO4Z3HYQWhYZ88n2vqQfr2aFB=',
      expiresIn: '7d',
    });

    return {
      accessTokenDev,
      refreshTokenDev,
    };
  }
  


  async validateRefreshToken(refreshTokenDev: string) {
    try {
      const payload = this.jwtService.verify(refreshTokenDev);
      const user = await this.usersService.findOneById(payload.sub);
      return user;
    } catch (e) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
