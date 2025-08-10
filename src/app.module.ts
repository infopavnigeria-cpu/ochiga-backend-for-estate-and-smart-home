// src/app.module.ts

// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      // The glob pattern below will find all files ending in .entity.ts
      // You should not import individual entities here.
      entities: [__dirname + '/**/*.entity.ts'], 
      synchronize: true, // Only for development
    }),
    UserModule,      // Correctly import and add the UserModule
    EstateModule,    // Correctly import and add the EstateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
