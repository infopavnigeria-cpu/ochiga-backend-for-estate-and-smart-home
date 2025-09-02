import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Estate } from './estates/estate.entity';
import { Home } from './homes/home.entity';
import { Room } from './rooms/room.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Estate, Home, Room],
      synchronize: true,  // auto-create tables in dev
    }),
    TypeOrmModule.forFeature([User, Estate, Home, Room]),
  ],
})
export class AppModule {}
