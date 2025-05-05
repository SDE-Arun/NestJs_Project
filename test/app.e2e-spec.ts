import { faker } from '@faker-js/faker/.';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';
// import { JwtAuthGuard } from './../src/auth/guards';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideGuard(JwtAuthGuard)
      // .useValue({ canActivate: () => true }) // Mock implementation
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('just for checking that, everything works fine or not ', () => {
    return request(app.getHttpServer()).get('/user').expect(200).expect('Hello Guys');
  });

  describe('User Controller', () => {
    const USER_INFO_PATH = '/user/info';
    // const mockToken = faker.internet.jwt();

    // let mockOutput: UserOutput;
    // beforeEach(() => {
    //   mockOutput = {
    //     id: faker.database.mongodbObjectId(),
    //     email: faker.internet.email(),
    //     firstName: faker.person.firstName(),
    //     lastName: faker.person.lastName(),
    //     createdAt: faker.date.past(),
    //     updatedAt: faker.date.future(),
    //   };
    // });

    it('returns UNAUTHORIZED {401} for missing token', async () => {
      await request(app.getHttpServer()).get(USER_INFO_PATH).expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns UNAUTHORIZED {401} for invalid token', async () => {
      const invalidToken = 'invalid.jwt.token';
      await request(app.getHttpServer())
        .get(USER_INFO_PATH)
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('signUp in Auth Controller', () => {
    const AUTH_SIGNUP_PATH = '/auth/signup';

    it('return {500}INTERNAL_SERVER_ERROR, if password is not present in input', () => {
      const input = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };
      return request(app.getHttpServer()).post(AUTH_SIGNUP_PATH).send(input).expect(HttpStatus.BAD_REQUEST);
    });

    it('return 201{CREATED}, if calls with a valid input', () => {
      const input = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };
      return request(app.getHttpServer()).post(AUTH_SIGNUP_PATH).send(input).expect(HttpStatus.CREATED);
    });

    it('return 201{CREATED}, if calls without first & last name ', () => {
      const input = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      return request(app.getHttpServer()).post(AUTH_SIGNUP_PATH).send(input).expect(HttpStatus.CREATED);
    });
  });

  describe('signIn in Auth Controller', () => {
    const AUTH_SIGNIN_PATH = '/auth/signin';

    it('return 403{FORBIDDEN, if the user is not already present ', () => {
      const input = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      return request(app.getHttpServer()).post(AUTH_SIGNIN_PATH).send(input).expect(HttpStatus.FORBIDDEN);
    });
  });

  // describe('getProfile in User Controller', () => {
  //   const AUTH_SIGNIN_PATH = '/user/info';
  //   it('return 403{FORBIDDEN} , if the user is not already present ', () => {
  //     const input = {
  //       email: faker.internet.email(),
  //       password: faker.internet.password(),
  //       firstName: faker.person.firstName(),
  //       lastName: faker.person.lastName(),
  //     };
  //     return request(app.getHttpServer()).post(AUTH_SIGNIN_PATH).send(input).expect(HttpStatus.FORBIDDEN);
  //   });
  // });
});
