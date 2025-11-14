import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');

  logger.log(`App running on host: ${process.env.HOST ?? 'localhost'} and port ${process.env.PORT ?? 3000}`);
}
bootstrap();
