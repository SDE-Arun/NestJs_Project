import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserOutput } from '../../interfaces';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaConnectionService } from '../../prisma-connection/prisma-connection.service';
import { AppLoggerService } from '../../logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaConnectionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService
  ) {}

  async getInfoFromToken(token: string): Promise<UserOutput> {
    this.logger.log(`calling ${this.getInfoFromToken.name} from the User Service`);
    if (token) {
      try {
        const secret = this.configService.get('JWT_SECRET');
        const decoded = await this.jwtService.verifyAsync(token, { secret });
        this.logger.log(`verifying the token with our secret key ..... `);
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
        this.logger.error(`we are in error section, we are getting this error ${error}`);
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new ForbiddenException('Credentials are incorrect');
          }
        }
        throw error;
      }
    }
    this.logger.warn(`nothing is working fine, and don't get anything  ** `);
    return {} as UserOutput;
  }
}
