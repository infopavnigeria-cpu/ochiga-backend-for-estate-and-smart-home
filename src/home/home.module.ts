import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './entities/home.entity';
import { HomeMember } from './entities/home-member.entity'; // if you created HomeMember
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Home, HomeMember])], // register both if you use HomeMember
  providers: [HomeService],
  controllers: [HomeController],
  exports: [HomeService],
})
export class HomeModule {}