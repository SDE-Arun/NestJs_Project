import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaConnectionService } from '../../prisma-connection/prisma-connection.service';
import { AuthDTO } from '../dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaConnectionService,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signUp(create: AuthDTO) {
    const hashPassword = await argon.hash(create.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: create.email,
          hash: hashPassword,
        },
        //* we are only getting these below things in the output after success
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return this.generateToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
      throw error;
    }
  }

  async signIn(input: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new ForbiddenException('Credentials are incorrect');

    const isPasswordMatch = await argon.verify(user.hash, input.password);
    if (!isPasswordMatch) throw new ForbiddenException('Credentials are incorrect');

    return this.generateToken(user.id, user.email);
  }

  async generateToken(userId: number, email: string): Promise<{ access_token: string }> {
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
