import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import * as fastify from 'fastify';

const fastifyInstance = fastify();
fastifyInstance.addHook('onRequest', (request: any, reply: any, done: any) => {
  reply.setHeader = function (key: any, value: any) {
    return this.raw.setHeader(key, value);
  };
  reply.end = function () {
    this.raw.end();
  };
  request.res = reply;
  done();
});

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());
  // await app.listen(process.env.APP_PORT);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  );
  app.register(fastifyCookie);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
