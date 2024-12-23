import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaConnectionService } from 'src/prisma-connection/prisma-connection.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt' //* this is byDefault, but we can add jwt_refesh_token or something else --> we can see that in user/controller with useGaurds
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaConnService: PrismaConnectionService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.prismaConnService.user.findUnique({
      where: { id: payload.sub },
    });
    delete user.hash;
    return user;
  }
}
