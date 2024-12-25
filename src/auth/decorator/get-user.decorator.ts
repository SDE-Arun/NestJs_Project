import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  //* Just for getting the email or data other than our request
  // if (data) {
  //   return request.user[data];
  // }
  return request.user;
});
