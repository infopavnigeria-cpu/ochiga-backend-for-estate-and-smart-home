import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateMessageDto } from './dto/create-message.dto';

// Posts
@HttpPost('posts')
createPost(@Body() data: CreatePostDto) {
  return this.communityService.createPost(data);
}

// Comments
@HttpPost('posts/:id/comments')
addComment(@Param('id') id: string, @Body() data: CreateCommentDto) {
  return this.communityService.addComment(id, data);
}

// Groups
@HttpPost('groups')
createGroup(@Body() data: CreateGroupDto) {
  return this.communityService.createGroup(data);
}

// Messages
@HttpPost('messages')
createMessage(@Body() data: CreateMessageDto) {
  return this.communityService.createMessage(data);
}
