import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { createMock } from '@golevelup/ts-jest';
import { AuthDTO } from './dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create User', () => {
  //   let mockInput: AuthDTO;
  //   beforeEach(() => {
  //     mockInput = {
  //       email: faker.internet.email(),
  //       password: faker.internet.password(),
  //     };
  //   });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  // it('should call the signUp function', async () => {
  //   const result = await service.signUp(mockInput);
  //   console.log(result);

  //   expect(result).toHaveBeenCalled();
  // });
  // });
});
