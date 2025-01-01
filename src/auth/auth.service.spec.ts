import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { AuthDTO } from './dto';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaConnectionService } from '../prisma-connection/prisma-connection.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaConnectionService,
          useValue: {
            user: {
              create: jest.fn(), // Mock Prisma's `create` method
            },
          },
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaConnectionService>(PrismaConnectionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp function', () => {
    // Arrange
    let mockInput: AuthDTO;
    beforeEach(() => {
      mockInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call the signUp function', () => {
      //Arrange and Act
      const result = jest.spyOn(service, 'signUp');

      // Assert
      expect(result).toHaveBeenCalled;
    });

    it('should return the token', async () => {
      //Arrange
      const token = faker.internet.jwt();
      jest.spyOn(service, 'signUp').mockResolvedValue({ access_token: token });

      // Act
      const result = await service.signUp(mockInput);

      // Assert
      expect(result).toEqual({ access_token: token });
    });

    // it('throw ForbiddenException, if the email is already exist', async () => {
    //   // Arrange
    //   // jest.mock('argon2');
    //   // const hashedPassword = 'hashedPassword123';
    //   // const error = new ForbiddenException('Email already exists');

    //   // jest.spyOn(argon, 'hash').mockResolvedValue(hashedPassword);
    //   // jest.spyOn(prismaService.user, 'create').mockRejectedValue('Email already exists');
    //   jest.spyOn(service, 'signUp').mockRejectedValue('Email already exists');

    //   // Act
    //   const result = await service.signUp(mockInput);
    //   console.log(result);
    //   // Assert
    //   expect(result).rejects.toThrow('Email already exists');
    // });
  });
});
