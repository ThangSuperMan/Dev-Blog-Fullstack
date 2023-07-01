import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
// import * as cookieParser from 'cookie-parser';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());
  // await app.listen(process.env.APP_PORT);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyCookie);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
