import { faker } from '@faker-js/faker';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthDTO } from '../dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: DeepMocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    let createInput: AuthDTO;
    beforeEach(() => {
      createInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    });

    it('should call authService.signUp exactly one time', () => {
      //   Act;
      controller.signup(createInput);

      //   Assert;
      expect(authService.signUp).toHaveBeenCalledTimes(1);
    });

    it('should call function with required input', () => {
      // Act
      controller.signup(createInput);

      // Assert
      expect(authService.signUp).toHaveBeenCalledWith(createInput);
    });

    it('should return the token, if call with valid input', async () => {
      // Arrange
      const token = faker.internet.jwt();
      jest.spyOn(controller, 'signup').mockResolvedValue({ access_token: token });

      // Act
      const result = await controller.signup(createInput);

      // Assert
      expect(result).toEqual({ access_token: token });
    });
  });

  describe('signIn', () => {
    let createInput: AuthDTO;
    beforeEach(() => {
      createInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    });

    it('should call authService.signIn exactly one time', () => {
      // Act
      controller.signin(createInput);

      // Assert
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });

    it('should call function with required input', () => {
      // Act
      controller.signin(createInput);

      // Assert
      expect(authService.signIn).toHaveBeenCalledWith(createInput);
    });

    it('should return the token, if call with valid input', async () => {
      // Arrange
      const token = faker.internet.jwt();
      jest.spyOn(controller, 'signin').mockResolvedValue({ access_token: token });

      // Act
      const result = await controller.signin(createInput);

      // Assert
      expect(result).toEqual({ access_token: token });
    });
  });
});
