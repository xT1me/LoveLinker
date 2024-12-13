import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MessagesService } from './messages.service';
  
  @WebSocketGateway({ cors: true })
  export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly messagesService: MessagesService) {}
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: any) {
      const message = await this.messagesService.sendMessage(payload);
      const chatRoom = this.getChatRoom(payload.senderId, payload.receiverId);
      this.server.to(chatRoom).emit('newMessage', message);
    }
  
    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, { user1Id, user2Id }: { user1Id: string; user2Id: string }) {
      const chatRoom = this.getChatRoom(user1Id, user2Id);
      client.join(chatRoom);
    }
  
    @SubscribeMessage('markMessageAsRead')
    async handleMarkAsRead(client: Socket, messageId: string) {
      try {
        await this.messagesService.markAsRead(messageId);

        const message = await this.messagesService.markAsRead(messageId);
        const chatRoom = this.getChatRoom(message.senderId, message.receiverId);
        this.server.to(chatRoom).emit('messageRead', messageId);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  
    private getChatRoom(user1Id: string, user2Id: string): string {
      return [user1Id, user2Id].sort().join('_');
    }
  }
  

  