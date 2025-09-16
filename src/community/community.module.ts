import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Post } from './entities/post.entity';
import { Group } from './entities/group.entity';
import { Comment } from './entities/comment.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Group, Comment, Message])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
