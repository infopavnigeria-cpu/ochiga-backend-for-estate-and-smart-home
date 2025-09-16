// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in DTO
      forbidNonWhitelisted: true, // throw error for unexpected properties
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  // ✅ Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Ochiga Smart Home & Estate API')
    .setDescription('API documentation for Ochiga backend services')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Use Codespaces PORT if available
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`🚀 Ochiga Backend running on: ${url}`);
  console.log(`📖 Swagger Docs available at: ${url}/api`);
}
bootstrap();
