import {
  ArrayContains,

  IsArray,

  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidRoles } from '../interfaces/valid-roles';
export class CreateUserDto {
  email: string;

  password: string;

  fullName: string;

  address: string;

  amount: number;

  @IsArray()
  @ArrayContains(Object.values(ValidRoles))
  roles: string[];
}
