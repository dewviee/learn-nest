import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeEntity } from 'src/common/entities/post/post-like.entity';
import { PostEntity } from 'src/common/entities/post/post.entity';
import { UserEntity } from 'src/common/entities/post/user.entity';
import { Equal, Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetPostDTO } from './dto/get-posts.dto';
import { PostGetFeedService } from './post-get-feed.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepo: Repository<PostLikeEntity>,
    private readonly postGetFeed: PostGetFeedService,
  ) {}

  async createPost(body: CreatePostDTO, user: UserEntity) {
    const post = this.postRepo.create({
      content: body.content,
      user: user,
    });

    const createdPost = await this.postRepo.save(post);

    const userData = {
      username: createdPost.user.username,
    };
    createdPost.user = undefined;

    return { ...createdPost, user: userData };
  }

  async getNextPost(body: GetPostDTO) {
    const offset = await this.postGetFeed.getPostOffset(body);

    const posts = await this.postRepo.find({
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          username: true,
        },
      },
      relations: { user: true },
      order: { createdAt: body.orderBy },
      take: body.quantity,
      skip: offset,
    });

    return posts;
  }

  async findPostById(postId: string) {
    return this.postRepo.findOneBy({ id: Equal(postId) });
  }
}
