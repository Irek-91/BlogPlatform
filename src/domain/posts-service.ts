import { QueryPaginationType } from './../midlewares/pagination';
import { postInput, postsCollectionsType, postOutput, PostMongoDb } from '../types/types-posts';
import { blogsRepository } from './../repositories/blogs-db-repository';
import { postRepository } from "../repositories/post-db-repository";
import { paginatorPost } from '../types/types_paginator';
import { ObjectId } from 'mongodb';


export class PostsService {
    
    async findPost(paginationQuery: QueryPaginationType, userId: string| null) : Promise<paginatorPost> {
        return postRepository.findPost(paginationQuery, userId)
    }
    
    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string) : Promise<paginatorPost | boolean> {
        return postRepository.findPostsBlogId(paginationQuery, blogId)
    }

    async getPostId(id: string, userId: string| null):Promise<postOutput  | false> {
        return postRepository.getPostId(id, userId)
    }

    async deletePostId(id: string):Promise<boolean> {
        return await postRepository.deletePostId(id)       
    }

   

    async createdPostBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput | boolean> {
        
        const creatPost = await postRepository.createdPostId(title, shortDescription, content, blogId)
        return creatPost
    }

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postRepository.updatePostId(id, title, shortDescription, content, blogId)
    }

    async updateLikeStatusPostId (postId: string, userId:string, likeStatus:string): Promise<boolean | null> {
        return await postRepository.updateLikeStatusPostId(postId, userId, likeStatus)
    }

    async deletePostAll(): Promise<boolean> {
        return await postRepository.deletePostAll()
    }
}

//export const postsService = new PostsService()
