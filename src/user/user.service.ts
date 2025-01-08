import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserOutput } from '../interfaces';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async getInfoFromToken(token: string): Promise<UserOutput> {
    if (token) {
      try {
        const secret = this.configService.get('JWT_SECRET');
        const decoded = await this.jwtService.verifyAsync(token, { secret });
        return decoded;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('credentials taken');
          }
        }
        throw error;
      }
    }
    return {} as UserOutput;
  }
}
