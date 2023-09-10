import { QueryPaginationType } from './../midlewares/pagination';
import { postInput, postsCollectionsType, postOutput, PostMongoDb } from './../types/types-db';
import { blogsRepository } from './../repositories/blogs-db-repository';
import { postRepository } from "../repositories/post-db-repository";
import { paginatorPost } from '../types/types_paginator';
import { blogType } from '../types/types';
import { ObjectId } from 'mongodb';


export class PostsService {
    
    async findPost(paginationQuery: QueryPaginationType) : Promise<paginatorPost> {
        return postRepository.findPost(paginationQuery)
    }
    
    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string) : Promise<paginatorPost | boolean> {
        return postRepository.findPostsBlogId(paginationQuery, blogId)
    }

    async getPostId(id: string):Promise<postOutput  | false> {
        return postRepository.getPostId(id)
    }

    async deletePostId(id: string):Promise<boolean> {
        return await postRepository.deletePostId(id)       
    }

    async createdPostId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput | boolean> {

        const blog = await blogsRepository.getBlogId(blogId);
        if (!blog) {return false}

        const createdAt = new Date().toISOString();

        const newPost = new PostMongoDb (new ObjectId(),
                                        title,
                                        shortDescription,
                                        content,
                                        blogId,
                                        blog.name,
                                        createdAt)  
        
        const creatPost = await postRepository.createdPostId(newPost)
        return creatPost

    }

    async createdPostBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput | boolean> {

        const blog = await blogsRepository.getBlogId(blogId);
        if (blog === false) {return false}
        const createdAt = new Date().toISOString();

        const newPost = new PostMongoDb (new ObjectId(),
                                        title,
                                        shortDescription,
                                        content,
                                        blogId,
                                        blog!.name,
                                        createdAt)

        const creatPost = await postRepository.createdPostId(newPost)
        return creatPost
    }

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postRepository.updatePostId(id, title, shortDescription, content, blogId)
    }

    async deletePostAll(): Promise<boolean> {
        return await postRepository.deletePostAll()
    }
}

//export const postsService = new PostsService()
