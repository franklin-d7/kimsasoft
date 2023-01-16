import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { IncomingHttpHeaders } from 'http';
import { isValidObjectId, Model } from 'mongoose';

import { LoginUserDto, CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidRoles } from './interfaces/valid-roles';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    try {
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const result = this.cleanDocument(user);

      return {
        ...result,
        token: this.getJwtToken({ id: user._id }),
      };
    } catch (error) {
      this.handelDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userModel.findOne(
      { email: email },
      {
        email: true,
        password: true,
      },
    );

    if (!user) {
      throw new UnauthorizedException(`Credentials are no valid(email)`);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(`Credentials are no valid(password)`);
    }

    const result = this.cleanDocument(user);

    return { ...result, token: this.getJwtToken({ id: user._id }) };
  }

  async findOne(term: string) {
    let user: User;

    if (isValidObjectId(term)) {
      user = await this.userModel.findById(term);
    }

    if (!user) {
      throw new NotFoundException(`User with id "${term}" not found`);
    }

    return user;
  }

  async update(term: string, updateUserDto: UpdateUserDto, headers: IncomingHttpHeaders) {

    const { authorization } = headers;

    const token = authorization.split(' ')[1];
    

    const  { id }  = this.jwtService.verify(token);

    const user = await this.findOne(term);
    
    if( id !== user.id){
      throw new BadRequestException(`User not Unauthorized`);
    }
    
    try {
     
      await user.updateOne(updateUserDto);
      return { statusCode: 200, message:"User update success", data: {...updateUserDto} };
    } catch (error) {
      this.handelDBErrors(error);
    }
  }

  async remove(id: string) {
   
    await this.userModel.updateOne({_id: id}, { isActive: false } );
    return {
      "statusCode": 200,
      "message": "Users Delete"
    };
  }


  findAll() {
    return this.userModel.find().select('-__v');
  }

  private cleanDocument(data) {
    return data.toObject();
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  async chechAuthStatus(user: User) {
    const result = this.cleanDocument(user);

    return { ...result, token: this.getJwtToken({ id: user._id }) };
  }

  private handelDBErrors(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
  }
}
