import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  // global prefix
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
