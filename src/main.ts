// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = new Logger('Bootstrap');

  // ✅ Enable CORS for frontend
  app.enableCors({
    origin: [
      "https://ideal-space-enigma-q57px96qp7j3x7pr-3000.app.github.dev", // frontend
    ],
    credentials: true,
  });

  // ✅ Global validation rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Global error handler
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('Ochiga Smart Home & Estate API')
    .setDescription('API documentation for Ochiga backend services')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter JWT token as: Bearer <your-token>',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ✅ Works locally & in Codespaces
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Ochiga Backend running on: ${await app.getUrl()}`);
  logger.log(`📖 Swagger Docs available at: ${await app.getUrl()}/api`);
}
bootstrap();
