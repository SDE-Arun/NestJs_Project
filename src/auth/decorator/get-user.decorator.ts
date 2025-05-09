import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { UserOutput } from '../../interfaces';

// export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
//   const request: Express.Request = ctx.switchToHttp().getRequest();
//   //* Just for getting the email or data other than our request
//   if (data) {
//     if (request.user) {
//       return (request.user as UserOutput)[data as keyof UserOutput];
//     }
//   }
//   return request.user;
// });

export const GetToken = createParamDecorator((data: string, ctx: ExecutionContext): Promise<string> => {
  const request = ctx.switchToHttp().getRequest();
  const authorization = request.headers['authorization'];

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7);
  }
  return Promise.resolve('we do not get anything');
});
