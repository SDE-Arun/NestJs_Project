import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserOutput } from '../interfaces';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaConnectionService } from '../prisma-connection/prisma-connection.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaConnectionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async getInfoFromToken(token: string): Promise<UserOutput> {
    if (token) {
      try {
        const secret = this.configService.get('JWT_SECRET');
        const decoded = await this.jwtService.verifyAsync(token, { secret });
        const user = await this.prismaService.user.findUniqueOrThrow({
          where: { email: decoded.email },
          select: {
            id: true,
            firstName: true,
            LastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return user as unknown as UserOutput;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new ForbiddenException('Credentials are incorrect');
          }
        }
        throw error;
      }
    }
    return {} as UserOutput;
  }
}
