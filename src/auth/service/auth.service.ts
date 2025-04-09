import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { AppLoggerService } from '../../logger/logger.service';
import { PrismaConnectionService } from '../../prisma-connection/prisma-connection.service';
import { AuthInputDTO } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaConnectionService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
    private jwtService: JwtService
  ) {}

  async signUp(create: AuthInputDTO) {
    // Todo! fix this, that we don't want to show objects like this all the time JSON.stringify(create)
    this.logger.log(`calling ${this.signUp.name} from the auth Service with input --> ${JSON.stringify(create)}`);
    if (!create.password) {
      throw new Error('Password is required for hashing');
    }
    const hashPassword = await argon.hash(create.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: create.email,
          hash: hashPassword,
          firstName: create.firstName,
          LastName: create.lastName,
        },
        //* we are only getting these below things in the output after success
        select: {
          id: true,
          email: true,
          firstName: true,
          LastName: true,
          createdAt: true,
        },
      });
      this.logger.log(`${JSON.stringify(create)} is saved successfully in the database `);
      return this.generateToken(user.id, user.email);
    } catch (error) {
      this.logger.error(`we are in error section, and getting this error ${error}`);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('user with these credentials are already in db');
        }
      }
      throw error;
    }
  }

  async signIn(input: AuthInputDTO) {
    this.logger.log(`calling ${this.signIn.name} from the auth Service with input --> ${input}`);
    const user = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      this.logger.error(`credentials are incorrect given by the user`);
      throw new ForbiddenException('Credentials are incorrect');
    }

    const isPasswordMatch = await argon.verify(user.hash, input.password);
    if (!isPasswordMatch) {
      this.logger.error(`password doesn't match`);
      throw new ForbiddenException('Credentials are incorrect');
    }

    return this.generateToken(user.id, user.email);
  }

  async generateToken(userId: number, email: string): Promise<{ access_token: string }> {
    this.logger.log(
      `calling ${this.generateToken.name} from the auth Service with userId - ${userId} and email - ${email}`
    );
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return { access_token: token };
  }
}
