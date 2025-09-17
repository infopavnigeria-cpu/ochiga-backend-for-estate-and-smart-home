import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // Posts
  @Post('posts')
  createPost(@Body() data: CreatePostDto) {
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
  @Post('posts/:id/comments')
  addComment(@Param('id') id: string, @Body() data: CreateCommentDto) {
    return this.communityService.addComment(id, data);
  }

  // Groups
  @Post('groups')
  createGroup(@Body() data: CreateGroupDto) {
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
  @Post('messages')
  createMessage(@Body() data: CreateMessageDto) {
    return this.communityService.createMessage(data);
  }

  @Get('messages/conversation')
  getConversation(@Query('user1') user1: string, @Query('user2') user2: string) {
    return this.communityService.getConversation(user1, user2);
  }
}
