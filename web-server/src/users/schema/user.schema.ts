import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  userId: string;

  @Prop({ required: true, unique: true, min: 6, max: 20 })
  username: string;

  @Prop({ required: true, unique: true, max: 50 })
  email: string;

  @Prop({ required: true, min: 6 })
  password: string;

  @Prop()
  age?: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop([String])
  favoriteFoods?: string[];

  @Prop()
  refreshToknen: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
