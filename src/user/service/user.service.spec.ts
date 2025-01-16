import { faker } from '@faker-js/faker/.';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserOutput } from '../../interfaces';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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

  describe('getInfoFromToken function', () => {
    const mockToken = faker.internet.jwt();
    const mockDecoded = { email: 'test@example.com' };

    const mockOutput = {
      id: faker.number.int(),
      email: faker.internet.email(),
      hash: faker.internet.password(),
      firstName: faker.person.firstName(),
      LastName: faker.person.lastName(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.future(),
    };

    beforeEach(() => {
      // common part in all the below test cases
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockDecoded);
    });

    it('should return user data for a valid token', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue(mockOutput);

      // Act
      const result = await service.getInfoFromToken(mockToken);

      // Assert
      expect(result).toEqual(mockOutput);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken, { secret: 'test_jwt_secret' });
    });

    it('should throw ForbiddenException if user is not found (P2025)', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockRejectedValue(new ForbiddenException('Unexpected error'));

      // Act & Assert
      await expect(service.getInfoFromToken(mockToken)).rejects.toThrow('Unexpected error');
    });

    it('should return an empty object if token is valid but cannot find the user', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue({} as typeof mockOutput);

      // Act
      const result = await service.getInfoFromToken(mockToken);

      // Assert
      expect(result).toEqual({});
    });
  });
});
