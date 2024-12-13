import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      roles: ['ROLE_USER']
    });
    const savedUser = await createdUser.save();

    const userWithoutPassword = savedUser.toObject() as User;
    return userWithoutPassword;
  }

  async findAllWithoutAdmin(userId: string): Promise<User[]> {
    return this.userModel.find({ _id: { $ne: userId }, roles: { $ne: 'ROLE_ADMIN' } }).exec();
  }

  

  async addRole(userId: string, role: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
    }
  }


  async findAll(userId: string): Promise<User[]> {
    return this.userModel.find({ _id: { $ne: userId } }).exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }


  async findOneById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject();
  }

  async getUsers(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }
  
  async updateUser(id: string, updateUserDto: UpdateUserDto, photoUrl?: string): Promise<User> {
    const updateData = { ...updateUserDto };
  
    if (photoUrl) {
      updateData.photoUrl = photoUrl;
    }
  
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  
  

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async addToFavorites(userId: string, targetUserId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: targetUserId } },
      { new: true }
    ).exec();
  }

  async removeFromFavorites(userId: string, targetUserId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { favorites: targetUserId } },
      { new: true }
    ).exec();
  }
}
