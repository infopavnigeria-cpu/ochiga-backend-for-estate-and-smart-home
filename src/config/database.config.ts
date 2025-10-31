// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isPostgres = (process.env.DB_TYPE || '').toLowerCase() === 'postgres';

  if (isPostgres) {
    console.log('📦 Using PostgreSQL database');
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'estate_app',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    };
  }

  console.log('💾 Using SQLite fallback database');
  return {
    type: 'sqlite',
    database: process.env.SQLITE_PATH || path.join(__dirname, '../../data/estate.sqlite'),
    synchronize: process.env.SQLITE_SYNC === 'true',
    autoLoadEntities: true,
    logging: true,
  };
};
