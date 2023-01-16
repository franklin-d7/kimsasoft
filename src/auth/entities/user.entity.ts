import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ValidRoles } from '../interfaces/valid-roles';

@Schema()
export class User extends Document {
  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    trim: true,
  })
  fullName: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
    default: ['user'],
    required: true,
    enum: [ValidRoles.admin, ValidRoles.superUser, ValidRoles.user],
  })
  roles: string[];

  @Prop({
    type: String,
    required: true,
  })
  address: string;

  @Prop({
    type: Number,
    required: true,
  })
  amount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
