import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Group } from './entities/group.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  // Posts
  createPost(data: Partial<Post>) {
    const post = this.postRepo.create(data);
    return this.postRepo.save(post);
  }

  findAllPosts() {
    return this.postRepo.find({ relations: ['comments'], order: { createdAt: 'DESC' } });
  }

  async likePost(id: number) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) return null;
    post.likes += 1;
    return this.postRepo.save(post);
  }

  // Comments
  async addComment(postId: number, data: Partial<Comment>) {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) return null;
    const comment = this.commentRepo.create({ ...data, post });
    return this.commentRepo.save(comment);
  }

  // Groups
  createGroup(data: Partial<Group>) {
    const group = this.groupRepo.create(data);
    return this.groupRepo.save(group);
  }

  findAllGroups() {
    return this.groupRepo.find();
  }

  async toggleJoinGroup(id: number) {
    const group = await this.groupRepo.findOneBy({ id });
    if (!group) return null;
    group.joined = !group.joined;
    group.members += group.joined ? 1 : -1;
    return this.groupRepo.save(group);
  }
}
