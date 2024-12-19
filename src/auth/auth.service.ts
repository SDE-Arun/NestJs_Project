import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaConnectionService } from '../prisma-connection/prisma-connection.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaConnectionService) {}

  // write now type of input is any
  async signUp(input: AuthDTO) {
    const hashPassword = await argon.hash(input.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: input.email,
          hash: hashPassword,
        },
        //? we only get these below things in the output after success
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
      throw error;
    }
  }
  signIn() {
    return { msg: 'we are signed up' };
  }
}
