/* eslint-disable @typescript-eslint/no-floating-promises */
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './filters';
import { TransformInterceptor } from './interceptors';

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app
    .setGlobalPrefix(globalPrefix)
    .useGlobalInterceptors(new TransformInterceptor())
    .useGlobalFilters(new HttpExceptionFilter())
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

  const config = new DocumentBuilder()
    .setTitle('Soloproneur Finance Api')
    .setDescription('Documentation of Soloproneur Finance Api')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: `/${globalPrefix}/api-json`,
  });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
