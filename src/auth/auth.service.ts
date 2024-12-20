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
  async signIn(input: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new ForbiddenException('Credentials are incorrect');

    const isPasswordMatch = await argon.verify(user.hash, input.password);
    if (!isPasswordMatch) throw new ForbiddenException('Credentials are incorrect');

    delete user.hash;
    return user;
    // return { msg: 'we are signed up' };
  }
}
