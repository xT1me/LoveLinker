import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    JwtModule.register({
      secret: 'dL8oS1+WZ/pLvEYeMkmO4Z3HYQWhYZ88n2vqQfr2aFB=',
      signOptions: { expiresIn: '1d' },
    }), 
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesService],
})
export class MessagesModule {}
