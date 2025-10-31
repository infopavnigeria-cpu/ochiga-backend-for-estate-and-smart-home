import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Group } from './entities/group.entity';
import { Comment } from './entities/comment.entity';
import { Message } from './entities/message.entity';
import { AiAgent } from '../ai/ai.agent';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    private readonly aiAgent: AiAgent, // 🧠 Injected AI brain
  ) {}

  // Posts
  createPost(data: Partial<Post>) {
    const post = this.postRepo.create(data);
    return this.postRepo.save(post);
  }

  findAllPosts() {
    return this.postRepo.find({ relations: ['comments'], order: { createdAt: 'DESC' } });
  }

  async likePost(id: string) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) return null;
    post.likes = (post.likes || 0) + 1;
    return this.postRepo.save(post);
  }

  // Comments
  async addComment(postId: string, data: Partial<Comment>) {
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

  async toggleJoinGroup(id: string) {
    const group = await this.groupRepo.findOneBy({ id });
    if (!group) return null;
    group.joined = !group.joined;
    group.members = Math.max(0, (group.members || 0) + (group.joined ? 1 : -1));
    return this.groupRepo.save(group);
  }

  // Messages
  createMessage(data: Partial<Message>) {
    const msg = this.messageRepo.create(data);
    return this.messageRepo.save(msg);
  }

  getConversation(user1: string, user2: string) {
    return this.messageRepo.find({
      where: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  // 🧠 AI Feature: Summarize feedback, posts, and sentiment
  async summarizeCommunityFeedback(feedback: any[]) {
    const prompt = `Summarize community discussions and highlight positive/negative sentiment:
    ${JSON.stringify(feedback, null, 2)}`;
    return await this.aiAgent.queryExternalAgent(prompt, feedback);
  }

  // 🧠 AI Feature: Detect trending topics or potential community conflicts
  async detectCommunityTrends(posts: any[]) {
    const prompt = `Analyze community posts to identify trending topics, shared concerns, and possible disputes:
    ${JSON.stringify(posts, null, 2)}`;
    return await this.aiAgent.queryExternalAgent(prompt, posts);
  }
}
