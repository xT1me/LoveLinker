import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  middleName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  description: string;

  @Prop()
  instagram: string;

  @Prop()
  twitter: string;

  @Prop()
  facebook: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  sex: string;

  @Prop({ type: [{ type: String }] })
  favorites: string[];

  @Prop()
  photoUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
