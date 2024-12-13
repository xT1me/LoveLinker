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
  Patch,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
    return this.usersService.findAllWithoutAdmin(id);
  }  

  @UseGuards(JwtAuthGuard)
  @Patch(':id/add-role')
  async addRole(
    @Param('id') id: string, 
    @Body('role') role: string
  ) {
    await this.usersService.addRole(id, role);
    return { message: `Role ${role} added successfully` };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorites')
  async addToFavorites(
    @Param('id') userId: string,
    @Body() favoriteDto: FavoriteDto,
  ) {
    return this.usersService.addToFavorites(userId, favoriteDto.targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorites/:targetUserId')
  async removeFromFavorites(
    @Param('id') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.usersService.removeFromFavorites(userId, targetUserId);
  }
}
