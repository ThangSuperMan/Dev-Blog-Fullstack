import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import constants from './constants/index';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
      }),
      envFilePath: '.development.env',
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
      ttl: constants.ONE_HOUR_IN_MILISECONDS,
      max: constants.REDIS_MAX_ITEM_IN_STORE,
    }),
    UsersModule,
    AuthModule,
    // TODO: need to migrate to the scalebility and continuesly mongodb with docker
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
