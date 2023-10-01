import { QueryPaginationType } from './../midlewares/pagination';
import { postInput, postsCollectionsType, postOutput, PostMongoDb } from '../types/types-posts';
import { paginatorPost } from '../types/types_paginator';
import { ObjectId } from 'mongodb';
import { PostRepository } from '../repositories/post-db-repository';


export class PostsService {
    private postRepository: PostRepository

    constructor () {
        this.postRepository = new PostRepository()
    }
    async findPost(paginationQuery: QueryPaginationType, userId: string | null): Promise<paginatorPost> {
        return this.postRepository.findPost(paginationQuery, userId)
    }

    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string): Promise<paginatorPost | boolean> {
        return this.postRepository.findPostsBlogId(paginationQuery, blogId)
    }

    async getPostId(id: string, userId: string | null): Promise<postOutput | false> {
        return this.postRepository.getPostId(id, userId)
    }

    async deletePostId(id: string): Promise<boolean> {
        return await this.postRepository.deletePostId(id)
    }

    async createdPostBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput | boolean> {

        const creatPost = await this.postRepository.createdPostId(title, shortDescription, content, blogId)
        return creatPost
    }

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postRepository.updatePostId(id, title, shortDescription, content, blogId)
    }

    async updateLikeStatusPostId(postId: string, userId: string, likeStatus: string): Promise<boolean | null> {
        return await this.postRepository.updateLikeStatusPostId(postId, userId, likeStatus)
    }

    async deletePostAll(): Promise<boolean> {
        return await this.postRepository.deletePostAll()
    }
}