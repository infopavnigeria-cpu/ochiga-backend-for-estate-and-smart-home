import { Controller, Get, Post as HttpPost, Body, Param, Patch } from '@nestjs/common';
import { CommunityService } from './community.service';
import { Post as PostEntity } from './entities/post.entity';
import { Group } from './entities/group.entity';

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
  likePost(@Param('id') id: number) {
    return this.communityService.likePost(id);
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
  toggleJoinGroup(@Param('id') id: number) {
    return this.communityService.toggleJoinGroup(id);
  }
}
