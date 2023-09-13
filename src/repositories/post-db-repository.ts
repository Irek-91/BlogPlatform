import { QueryPaginationType } from './../midlewares/pagination';
import { postInput, postOutput } from "../types/types-db";
import { ObjectId } from "mongodb";
import { paginatorPost } from "../types/types_paginator";
import { PostsModelClass } from '../db/db-mongoos';


export const postRepository = {
    
    async findPost(paginationQuery: QueryPaginationType,) : Promise<paginatorPost> {
        const posts = await PostsModelClass.find({}).
                                            sort([[paginationQuery.sortBy, paginationQuery.sortDirection]]).
                                            skip(paginationQuery.skip).
                                            limit(paginationQuery.pageSize)
        const totalCount = await PostsModelClass.countDocuments()
        const pagesCount = Math.ceil(totalCount/paginationQuery.pageSize)
        const postsOutput : postOutput[] = posts.map((b) => {
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
        return {pagesCount: pagesCount,
        page: paginationQuery.pageNumber,
        pageSize: paginationQuery.pageSize,
        totalCount: totalCount,
        items : postsOutput
        }
    },
    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string) : Promise<paginatorPost | boolean> {
        try {
            
            const filter = {blogId:blogId}
            const posts = await PostsModelClass
                                            .find(filter)
                                            .sort([[paginationQuery.sortBy, paginationQuery.sortDirection]])
                                            .skip(paginationQuery.skip)
                                            .limit(paginationQuery.pageSize)
                                            .lean();
       
        const totalCount = await PostsModelClass.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount/(paginationQuery.pageSize))
        const postsOutput : postOutput[] = posts.map((b) => {
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
        return {pagesCount: pagesCount,
        page: paginationQuery.pageNumber,
        pageSize: paginationQuery.pageSize,
        totalCount: totalCount,
        items : postsOutput
        }} catch (e) {return false}

    },

    
    async getPostId(id: string):Promise<postOutput | false> {
        
        try {let post =  await PostsModelClass.findOne({_id: new ObjectId(id)});
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
        }} catch (e) {return false}
        },

    async deletePostId(id: string):Promise<boolean> {
        const postInstance = await PostsModelClass.findOne({_id: new ObjectId(id)})
        if (!postInstance) {return false}

        await postInstance.deleteOne()
        return true
    },
    
        
    async createdPostId(newPost:postInput): Promise<postOutput> {     
        const postInstance = new PostsModelClass(newPost)
        
        await postInstance.save()
        return {
            id: postInstance._id.toString(),
            title: postInstance.title,
            shortDescription: postInstance.shortDescription,
            content: postInstance.content,
            blogId: postInstance.blogId,
            blogName: postInstance.blogName,
            createdAt: postInstance.createdAt
        }
    },


    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        //const postInstance = await PostsModelClass.updateOne({_id: new ObjectId(id)}, {$set: {title , shortDescription, content, blogId}})    
        const postInstance = await PostsModelClass.findOne({_id: new ObjectId(id)})
        if (!postInstance) return false
        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.save()
        return true
        },

    async deletePostAll(): Promise<boolean> {
        const postInstance = await PostsModelClass.deleteMany({})
        if (!postInstance) {return false}
        return true
    }
}
