import { blogsRepository } from "./blogs-db-repository";
import { postsCollections } from "../db/db-mongo";
import { postInput, postMongoDb, postOutput, postsCollectionsType } from "../types/types-db";
import { ObjectId } from "mongodb";
import { paginatorPost } from "../types/types_paginator";


export const postRepository = {
    
    async findPost(pageNumber: number, pageSize:number,sortBy: string, sortDirections: any) : Promise<paginatorPost> {
        const skipPosts = (pageNumber -1)*pageSize;
        const posts = await postsCollections.find({}).sort(sortBy,sortDirections).skip(skipPosts).limit(pageSize).toArray();
        const totalCount = await postsCollections.count()
        const postsOutput = posts.map((b) => {
            return {
                id: b._id.toString(),
                title: b.title,
                shortDescription: b.shortDescription,
                content: b.content,
                blogId: b.blogId,
                blogName: b.blogName,
                createdAt: b.createdAt,
            }
        })
        return {pagesCount: postsOutput.length,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items : postsOutput
        }
    },
    async findPostsBlogId(pageNumber: number, pageSize:number,sortBy: string, sortDirections: any, blogId: string) : Promise<paginatorPost> {
        const skipPosts = (pageNumber -1)*pageSize;
        const posts = await postsCollections.find({blogId:blogId}).sort(sortBy,sortDirections).skip(skipPosts).limit(pageSize).toArray();
        const totalCount = await postsCollections.count()
        const postsOutput = posts.map((b) => {
            return {
                id: b._id.toString(),
                title: b.title,
                shortDescription: b.shortDescription,
                content: b.content,
                blogId: b.blogId,
                blogName: b.blogName,
                createdAt: b.createdAt,
            }
        })
        return {pagesCount: postsOutput.length,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items : postsOutput
        }
    },

    async getPostId(id: string):Promise<postOutput | null | boolean> {
        
        let post =  await postsCollections.findOne({_id: new ObjectId(id)});
        if (!post) {
            return false
        } else {
        return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            }
        }
        },

    async deletePostId(id: string):Promise<boolean> {
        let post = await postsCollections.findOne({_id: new ObjectId(id)})
        
        if (post) {
            try {
            await postsCollections.deleteOne({_id: post._id})
            return true}
            catch (e) {return false}
        } else {return false}       
        },

        
    async createdPostId(newPost:postInput): Promise<postOutput> {     
        const res = await postsCollections.insertOne({...newPost});
              
        return {
            id: res.insertedId.toString(),
            ...newPost
        }
    },

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const post = await postsCollections.updateOne({_id: new ObjectId(id)}, {$set: {title , shortDescription, content, blogId}})    
        if (post.matchedCount) {
            return true}
            else {
            return false} 
    },

    async deletePostAll(): Promise<boolean> {
        const deletResult = await postsCollections.find({}).toArray();
        if (deletResult) {
            try {await postsCollections.deleteMany({})
            return true}
            catch (e) {return false}}
            else 
            {return false}
    }
}
