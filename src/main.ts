import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestContainer, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as fs from 'fs';
import { DebuggedProvider, DebuggedTree, SpelunkerModule } from 'nestjs-spelunker';

import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { ErrorHandling } from './errorHandling/errorHandling.exception';

const getGlobalModules = (app: INestApplication) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules = ((app as any).container as NestContainer).getModules();
  const modulesArray = Array.from(modules.values());
  const globalModuels = modulesArray.filter((modules) => modules.isGlobal).map((module) => module.metatype.name);

  return globalModuels;
};

//? To generate whole project graph
const generateAppGraph = (app: INestApplication) => {
  const globalModules = getGlobalModules(app);

  const tree = SpelunkerModule.explore(app, { ignoreImports: [(modulename) => globalModules.includes(modulename)] });
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);

  let graph = `graph LR\n`;

  edges.forEach(({ from, to }) => {
    graph += `${from.module.name} ---> ${to.module.name}\n`;
  });

  return graph;
};

//? To generate specific module dependency graph
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateModuleGraph = async (module: Type<any>) => {
  const dependencies = await SpelunkerModule.debug(module);

  let moduleGraph = `graph LR\n`;

  dependencies.forEach((module: DebuggedTree) => {
    module.imports.forEach((importedModule: string) => {
      moduleGraph += `${module.name} ---> ${importedModule}\n`;
    });
  });

  return moduleGraph;
};

//? To generate graph specific dependency {like providers && controller}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateModuleProvidesGraph = async (rootModule: Type<any>) => {
  const dependencies = await SpelunkerModule.debug(rootModule);

  let providerGraph = `graph LR\n`;

  dependencies.forEach((module: DebuggedTree) => {
    const moduleItems = [...module.providers, ...module.controllers];
    moduleItems.forEach((moduleItem: DebuggedProvider) => {
      return moduleItem.dependencies.forEach((dependency: string) => {
        providerGraph += ` ${String(moduleItem.name)} --> ${String(dependency)}\n`;
      });
    });
  });

  const generateSubGraph = (module: DebuggedTree) => {
    let subGraph = `  subgraph ${module.name}\n`;

    const innerItems = Array.from(
      new Set(
        [...module.providers, ...module.controllers, ...module.exports].map((item: DebuggedProvider) => item.name)
      )
    );

    innerItems.forEach((itemName) => {
      subGraph += `  ${itemName}\n`;
    });

    subGraph += `   end\n`;

    return subGraph;
  };

  dependencies.forEach((module: DebuggedTree) => {
    providerGraph += generateSubGraph(module);
  });

  return providerGraph;
};

async function bootstrap() {
  //Todo: It means, here we start with AuthModule where we want to start the checking of everything about module
  const moduleGraph = await generateModuleGraph(AuthModule);
  fs.writeFileSync('auth.module.mmd', moduleGraph);

  const moduleProvidersGraph = await generateModuleProvidesGraph(AuthModule);
  fs.writeFileSync('auth.providers.mmd', moduleProvidersGraph);

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ErrorHandling());

  const graph = generateAppGraph(app);
  fs.writeFileSync('app.module.mmd', graph);

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
