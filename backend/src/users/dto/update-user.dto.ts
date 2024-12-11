import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    instagram?: string;

    @IsOptional()
    @IsString()
    twitter?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    facebook?: string;
  
    @IsOptional()
    @IsString()
    photoUrl?: string;
  }
  
