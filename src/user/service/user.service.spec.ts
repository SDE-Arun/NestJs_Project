import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaConnectionService } from '../../prisma-connection/prisma-connection.service';

describe('User Service', () => {
  let service: UserService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let prismaService: PrismaConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test_jwt_secret'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: PrismaConnectionService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn(),
            },
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaConnectionService>(PrismaConnectionService);
  });

  it('User service should be defined', () => {
    expect(service).toBeDefined();
  });
});
