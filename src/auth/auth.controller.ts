import { Controller, Get, Post, Body, Patch, Param, Delete, Headers} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
@ApiTags("User")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login( loginUserDto);
  }

  @Patch(':term')
  @Auth(ValidRoles.user)
  update(@Param('term', ParseMongoIdPipe) term:string, @Body() updateUserDto:UpdateUserDto, @Headers() headers:IncomingHttpHeaders){

    return this.authService.update(term, updateUserDto, headers);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.remove(id);
  }


  @Get('all-users')
  @Auth(ValidRoles.admin)
  findAll(){
    return this.authService.findAll();
  }


  @Get('renew-token')
  @Auth()
  checkAuthStatus(@GetUser() user: User){

    return this.authService.chechAuthStatus(user);

  }

}
