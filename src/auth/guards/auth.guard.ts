import { AuthGuard } from '@nestjs/passport';

//* Here we write --> `jwt` , as we mentioned that in "PassportStrategy" in 'jwt.strategy.ts' and same in 'user.controller.ts'
export class JWTGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
