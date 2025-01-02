import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { AuthDTO } from './dto';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaConnectionService } from '../prisma-connection/prisma-connection.service';
import { UserResult } from './constants';

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
              create: jest.fn(),
              findUnique: jest.fn(),
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

    it('throw ForbiddenException, if the email is already exist', async () => {
      // Arrange
      const hashedPassword = faker.internet.jwt();
      jest.spyOn(argon, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new ForbiddenException('Unexpected error'));

      // Act & Assert
      await expect(service.signUp(mockInput)).rejects.toThrow(Error);
      await expect(service.signUp(mockInput)).rejects.toThrow('Unexpected error');
    });
  });

  describe('signIn Function', () => {
    let mockInput: AuthDTO;
    let mockResult: UserResult;
    beforeEach(() => {
      mockInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      mockResult = {
        id: faker.number.int(10),
        email: mockInput.email,
        hash: mockInput.password,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        firstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully sign in a user and return a token', async () => {
      // Arrange
      const token = faker.internet.jwt();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockResult);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);
      jest.spyOn(service, 'generateToken').mockResolvedValue({ access_token: token });
      // Act
      const result = await service.signIn(mockInput);
      // Assert
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockInput.email },
      });
      expect(argon.verify).toHaveBeenCalledWith(mockResult.hash, mockInput.password);
      expect(service.generateToken).toHaveBeenCalledWith(mockResult.id, mockResult.email);
      expect(result).toEqual({ access_token: token });
    });

    it('should throw ForbiddenException if the user is not found', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      // Act & Assert
      await expect(service.signIn(mockInput)).rejects.toThrow(ForbiddenException);
      await expect(service.signIn(mockInput)).rejects.toThrow('Credentials are incorrect');
    });

    it('should throw ForbiddenException if the password is incorrect', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockResult);
      jest.spyOn(argon, 'verify').mockResolvedValue(false);
      // Act & Assert
      await expect(service.signIn(mockInput)).rejects.toThrow(ForbiddenException);
      await expect(service.signIn(mockInput)).rejects.toThrow('Credentials are incorrect');
    });

    it('should rethrow any unexpected errors from the database', async () => {
      // Arrange
      jest.spyOn(prismaService.user, 'findUnique').mockRejectedValue(new Error('Unexpected error'));
      // Act & Assert
      await expect(service.signIn(mockInput)).rejects.toThrow(Error);
      await expect(service.signIn(mockInput)).rejects.toThrow('Unexpected error');
    });
  });
});
