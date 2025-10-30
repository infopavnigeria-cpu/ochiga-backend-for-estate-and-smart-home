import 'dotenv/config'; // ensure envs are loaded as early as possible
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('🟡 Starting NestJS App...');

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  console.log('🟢 AppModule created successfully.');

  const logger = new Logger('Bootstrap');

  // Global API prefix (keeps health at /api/health)
  app.setGlobalPrefix('api');

  // Enable CORS (dev-friendly). Tighten this in production.
  app.enableCors({
    origin: [
      process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
      'https://ideal-system-wrjxv66vrwwphgwj6-3000.app.github.dev',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  console.log('✅ CORS, validation, and filters setup complete.');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global error filter (keep your custom one)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger (optional in prod)
  const config = new DocumentBuilder()
    .setTitle('Ochiga Smart Home & Estate API')
    .setDescription('API documentation for Ochiga backend services')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter JWT token as: Bearer <your-token>',
    })
    .build();

  console.log('⚙️ Generating Swagger documentation (if needed)...');
  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    console.log('✅ Swagger ready.');
  } catch (err) {
    console.warn('⚠️ Swagger generation failed (continuing):', err);
  }

  // port (Heroku / EB / Docker friendly)
  const port = Number(process.env.PORT) || 4000;
  console.log(`🚀 Starting HTTP listener on port ${port}...`);

  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  logger.log(`🚀 Ochiga Backend running on: ${url}`);
  logger.log(`📖 Swagger Docs available at: ${url}/api`);
  logger.log(`✅ Health Check available at: ${url}/api/health`);
}

bootstrap()
  .then(() => {
    console.log('✅ Nest application bootstrap completed successfully.');
  })
  .catch((err) => {
    console.error('❌ Fatal bootstrap error:', err);
    process.exit(1);
  });
