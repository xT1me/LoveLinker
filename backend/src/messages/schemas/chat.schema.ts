import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from './message.schema';

@Schema()
export class Chat extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user1: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user2: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Types.ObjectId[];

  @Prop({ default: 0 })
  unreadCount: number;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
