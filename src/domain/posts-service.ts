import {QueryPaginationType} from '../midlewares/pagination';
import {postOutput} from '../types/types-posts';
import {paginatorPost} from '../types/types_paginator';
import {PostRepository} from '../repositories/post-db-repository';


export class PostsService {

    constructor (protected postRepository: PostRepository) { }
    async findPost(paginationQuery: QueryPaginationType, userId: string | null): Promise<paginatorPost> {
        return this.postRepository.findPost(paginationQuery, userId)
    }


    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string, userId: string|null): Promise<paginatorPost | boolean> {
        return this.postRepository.findPostsBlogId(paginationQuery, blogId, userId)
    }

    async getPostId(id: string, userId: string | null): Promise<postOutput | false> {
        return this.postRepository.getPostId(id, userId)
    }

    async deletePostId(id: string): Promise<boolean> {
        return await this.postRepository.deletePostId(id)
    }

    async createdPostBlogId(title: string, shortDescription: string, content: string, blogId: string, blogName: string | boolean): Promise<postOutput | boolean> {

        return await this.postRepository.createdPostId(title, shortDescription, content, blogId, blogName)
    }

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        //100
        const post = await this.postRepository.getPostById(id)
        if(!post) {
            throw new Error('not found')
        }

        if (!post) return false
        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        //post.addLike()

        await this.postRepository.savePost(post)
        return true
    }

    async updateLikeStatusPostId(postId: string, userId: string, likeStatus: string): Promise<boolean | null> {
        return await this.postRepository.updateLikeStatusPostId(postId, userId, likeStatus)
    }
    async deletePostAll(): Promise<boolean> {
        return await this.postRepository.deletePostAll()
    }
}