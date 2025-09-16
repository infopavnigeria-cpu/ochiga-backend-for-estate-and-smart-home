// src/community/community.controller.ts
import { Controller, Get, Post as HttpPost, Body, Param, Patch, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { Post as PostEntity } from './entities/post.entity';
import { Group } from './entities/group.entity';
import { Comment } from './entities/comment.entity';
import { Message } from './entities/message.entity';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // Posts
  @HttpPost('posts')
  createPost(@Body() data: Partial<PostEntity>) {
    return this.communityService.createPost(data);
  }

  @Get('posts')
  getPosts() {
    return this.communityService.findAllPosts();
  }

  @Patch('posts/:id/like')
  likePost(@Param('id') id: string) {
    return this.communityService.likePost(id);
  }

  // Comments
  @HttpPost('posts/:id/comments')
  addComment(@Param('id') id: string, @Body() data: Partial<Comment>) {
    return this.communityService.addComment(id, data);
  }

  // Groups
  @HttpPost('groups')
  createGroup(@Body() data: Partial<Group>) {
    return this.communityService.createGroup(data);
  }

  @Get('groups')
  getGroups() {
    return this.communityService.findAllGroups();
  }

  @Patch('groups/:id/toggle')
  toggleJoinGroup(@Param('id') id: string) {
    return this.communityService.toggleJoinGroup(id);
  }

  // Messages
  @HttpPost('messages')
  createMessage(@Body() data: Partial<Message>) {
    return this.communityService.createMessage(data);
  }

  @Get('messages/conversation')
  getConversation(@Query('user1') user1: string, @Query('user2') user2: string) {
    return this.communityService.getConversation(user1, user2);
  }
}
