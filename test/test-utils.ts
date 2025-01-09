import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const userData = {
  id: 1,
  email: 'abc@gmail.com',
};

export const getDefaultUserAuthToken = async (app: INestApplication): Promise<{ token: string }> => {
  const jwtService = app.get(JwtService);
  const token = await jwtService.signAsync(userData);
  return { token };
};
