import { faker } from '@faker-js/faker';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';

describe('JuspayOrderController', () => {
  let controller: AuthController;
  let orderService: DeepMocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
    orderService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
