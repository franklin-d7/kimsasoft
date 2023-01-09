import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document  } from 'mongoose';

@Schema()
export class User extends Document {
  
  @Prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  })
  email: string;

  @Prop({
    required: true,
    select: false
  })
  password: string;

  @Prop({
    required: true,
    trim: true
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
  })
  roles: string[];

}


export const UserSchema = SchemaFactory.createForClass(User);

