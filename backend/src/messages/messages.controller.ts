import { Controller, Post, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.sendMessage(createMessageDto);
  }

  @Get(':userId')
  async getMessages(@Param('userId') userId: string) {
    return this.messagesService.getMessages(userId);
  }

  @Patch(':messageId/read')
  async markAsRead(@Param('messageId') messageId: string) {
    return this.messagesService.markAsRead(messageId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async getChat(@Body() chatDto: { user1Id: string; user2Id: string }) {
    const { user1Id, user2Id } = chatDto;
    return this.messagesService.getChat(user1Id, user2Id);
  }
}
