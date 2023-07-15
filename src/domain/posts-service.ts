import { postInput, postsCollectionsType, postOutput } from './../types/types-db';
import { blogsRepository } from './../repositories/blogs-db-repository';
import { postRepository } from "../repositories/post-db-repository";
import { paginatorPost } from '../types/types_paginator';


export const postsService = {
    
    async findPost(pageNumber: number, pageSize:number,sortBy: string, sortDirections: any) : Promise<paginatorPost> {
        return postRepository.findPost(pageNumber, pageSize,sortBy, sortDirections )
    },
    
    async findPostsBlogId(pageNumber: number, pageSize:number,sortBy: string, sortDirections: any, blogId: string) : Promise<paginatorPost | boolean> {
        return postRepository.findPostsBlogId(pageNumber, pageSize,sortBy, sortDirections, blogId)
    },

    async getPostId(id: string):Promise<postOutput | null | boolean> {
        return postRepository.getPostId(id)
    },

    async deletePostId(id: string):Promise<boolean> {
        return await postRepository.deletePostId(id)       
    },

    async createdPostId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput> {

        const blog = await blogsRepository.getBlogId(blogId);
        const createdAt = new Date().toISOString();

        const newPost:  postInput= {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: createdAt
            };
        const creatPost = await postRepository.createdPostId(newPost)
        return creatPost
    },

    async createdPostBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput | boolean> {

        const blog = await blogsRepository.getBlogId(blogId);
        if (!blog) {return false}
        const createdAt = new Date().toISOString();

        const newPost:  postInput= {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: createdAt
            };
        const creatPost = await postRepository.createdPostId(newPost)
        return creatPost
    },

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postRepository.updatePostId(id, title, shortDescription, content, blogId)
    },

    async deletePostAll(): Promise<boolean> {
        return await postRepository.deletePostAll()
    }
}
