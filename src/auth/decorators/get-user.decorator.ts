import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext)=> {

        const req = ctx.switchToHttp().getRequest();

       const user = req.user;

       if(!user){
         throw new InternalServerErrorException('User no found (request)')
       }

       return (!data) ? user : user[data];
}); 