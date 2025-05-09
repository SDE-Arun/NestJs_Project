import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// //* Here we write --> `jwt` , as we mentioned that in "PassportStrategy" in 'jwt.strategy.ts' and same in 'user.controller.ts'
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
