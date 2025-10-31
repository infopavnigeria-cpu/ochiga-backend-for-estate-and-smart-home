import 'dotenv/config'; // Ensure envs are loaded first
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  console.log('🟡 Starting NestJS App...');

  try {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    console.log('🟢 AppModule created successfully.');

    // Global prefix for all APIs
    app.setGlobalPrefix('api');

    // Enable CORS
    app.enableCors({
      origin: [
        process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        'https://paranormal-superstition-jjpw6xvj5gxvf5wqv-3000.app.github.dev',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // Validation and filters
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    console.log('✅ CORS, validation, and filters setup complete.');

    // Swagger (non-blocking)
    try {
      const config = new DocumentBuilder()
        .setTitle('Ochiga Smart Infrastructure API')
        .setDescription('API for smart home, estate & infrastructure services')
        .setVersion('1.0')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
          description: 'Use: Bearer <your-token>',
        })
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document, {
        swaggerOptions: { persistAuthorization: true },
      });
      console.log('✅ Swagger ready.');
    } catch (err) {
      console.warn('⚠️ Swagger generation failed (continuing):', err);
    }

    const port = Number(process.env.PORT) || 4000;
console.log(`🚀 Starting HTTP listener on port ${port}...`);

// ✅ Perfect spot — all modules initialized, app configured, ready to launch
console.log('🧩 All modules loaded. Launching server...');

await app.listen(port, '0.0.0.0');
const url = await app.getUrl();

logger.log(`🚀 Ochiga Backend running on: ${url}`);
logger.log(`📖 Swagger Docs: ${url}/api`);
logger.log(`✅ Health Check: ${url}/api/health`);
  } catch (error) {
    // 💥 This block catches silent DB startup errors and shows the cause
    console.error('❌ FATAL STARTUP ERROR!');
    console.error('🔍 Likely causes: Database misconfiguration or entity mismatch.');
    console.error('📄 Error stack trace:\n', error);
    process.exit(1);
  }
}

// Global safeguard for uncaught exceptions/rejections
process.on('uncaughtException', (err) => {
  console.error('💣 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

bootstrap()
  .then(() => console.log('✅ Nest application bootstrap completed successfully.'))
  .catch((err) => {
    console.error('❌ Fatal bootstrap error:', err);
    process.exit(1);
  });
