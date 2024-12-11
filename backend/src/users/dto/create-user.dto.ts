import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  middleName?: string;
  
  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  age: number;

  @IsString()
  sex: string;

  @IsString()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  facebook?: string;
}
