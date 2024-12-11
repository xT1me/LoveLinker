import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = file.originalname;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { photoUrl: `/uploads/${file.filename}` };
  }
  
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('list/:id')
  async getAllUsers(@Param('id') id: string) {
    return this.usersService.findAll(id)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.loginWithCredentials(loginDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Post(':id/favorites')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Param('id') userId: string,
    @Body() favoriteDto: FavoriteDto,
  ) {
    return this.usersService.addToFavorites(userId, favoriteDto.targetUserId);
  }

  @Delete(':id/favorites/:targetUserId')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(
    @Param('id') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.usersService.removeFromFavorites(userId, targetUserId);
  }
}
