import { Model } from "mongoose";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Message } from "./schemas/message.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async getMessages(userId: string): Promise<Message[]> {
    return this.messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });
  }

  async markAsRead(messageId: string): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );
  }
  

  async getChat(user1Id: string, user2Id: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      })
      .sort({ timestamp: 1 });
  }
}

