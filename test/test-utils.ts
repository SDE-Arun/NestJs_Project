import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const userData = {
  email: 'abc@gmail.com',
  password: 'password',
};

export const getDefaultUserAuthToken = async (app: INestApplication): Promise<{ token: string }> => {
  const jwtService = app.get(JwtService);
  const token = await jwtService.signAsync(userData);
  return { token };
};

//! To create the container to test-e2e
//* docker run --name prisma-test-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123 -e POSTGRES_DB=nest -p 5434:5432 -d postgres:latest
