import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.use(
    ['/swagger', '/swagger-json'],
    basicAuth({
      challenge: true,
      users: {
        [configService.getOrThrow('SWAGGER_USER')]: configService.getOrThrow('SWAGGER_PASSWORD'),
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle('NestJs Project')
    .setDescription('we are just creating the NestJs project with JWT Auth')
    .setVersion('1.0')
    .addTag('Nothing for now')
    .addBearerAuth()
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  //* here whitelist: true, showing that nothing will come with request other than our DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //* Removes unwanted properties
      //* It is not necessary to do this, we can use JOI and extend the PipeTransform class for validation
      forbidNonWhitelisted: true, //* Throws an error for unwanted properties
      transform: true, //* Automatically transforms payloads to match DTO types
      // disableErrorMessages:true, //! make it false for development env, but it is good for production env
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
