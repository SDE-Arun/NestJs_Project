import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { faker } from '@faker-js/faker/.';
import { UserOutput } from 'src/interfaces';
import { UserService } from '../service/user.service';
import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    const mockToken = faker.internet.jwt();
    let mockOutput: UserOutput;
    beforeEach(() => {
      mockOutput = {
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.future(),
      };
    });

    it('should return user profile for valid token', async () => {
      //Arrange
      jest.spyOn(service, 'getInfoFromToken').mockResolvedValue(mockOutput);

      // Act
      const result = await controller.getProfile(mockToken);

      // Assert
      expect(result).toEqual(mockOutput);
      expect(service.getInfoFromToken).toHaveBeenCalledWith(mockToken);
    });

    it('should throw BadRequestException for invalid token', async () => {
      //Arrange and Act
      jest.spyOn(service, 'getInfoFromToken').mockRejectedValue(new BadRequestException('wrong credentials'));

      // Assert
      await expect(controller.getProfile(mockToken)).rejects.toThrow(BadRequestException);
    });
  });
});
