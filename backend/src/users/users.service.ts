import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
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


  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
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
