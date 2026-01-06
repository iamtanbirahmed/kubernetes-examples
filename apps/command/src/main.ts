/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'command';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port);
  Logger.log(
    `🚀 Command Service is running on: http://${host}:${port}/${globalPrefix}`
  );
}

bootstrap();
