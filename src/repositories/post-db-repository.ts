import { newestLikes } from './../types/types-posts';
import { QueryPaginationType } from './../midlewares/pagination';
import { ObjectId } from "mongodb";
import { paginatorPost } from "../types/types_paginator";
import { LikesPostsClass, PostsModelClass, UsersModelClass } from '../db/db-mongoos';
import { PostMongoDb, postOutput } from '../types/types-posts';
import { log } from 'console';
import { BlogsRepository } from './blogs-db-repository';

export class PostRepository {
    private blogsRepository : BlogsRepository
    constructor () {
        this.blogsRepository = new BlogsRepository
    }
    async findPost(paginationQuery: QueryPaginationType, userId: string | null): Promise<paginatorPost> {
        const posts = await PostsModelClass.find({}).
            sort([[paginationQuery.sortBy, paginationQuery.sortDirection]]).
            skip(paginationQuery.skip).
            limit(paginationQuery.pageSize)
        const totalCount = await PostsModelClass.countDocuments()
        const pagesCount = Math.ceil(totalCount / paginationQuery.pageSize)
        const postsOutput: postOutput[] = await Promise.all(posts.map(async (b) => {
            let myStatus = 'None'
            if (userId) {
                const status = await LikesPostsClass.findOne({ userId, postId: b._id.toString() })
                if (status) {
                    myStatus = status.status
                }
            }
            const newestLikes = await LikesPostsClass.find({ postId: b.id, status: 'Like' }).sort({ createdAt: 1 }).skip(3).lean()
            const newestLikesMaped: newestLikes[] = newestLikes.map((like) => {
                return {
                    addedAt: like.createdAt,
                    userId: like.userId,
                    login: like.login
                }
            })
            return {
                id: b._id.toString(),
                title: b.title,
                shortDescription: b.shortDescription,
                content: b.content,
                blogId: b.blogId,
                blogName: b.blogName,
                createdAt: b.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: myStatus,
                    newestLikes: newestLikesMaped
                }

            }
        }))
        return {
            pagesCount: pagesCount,
            page: paginationQuery.pageNumber,
            pageSize: paginationQuery.pageSize,
            totalCount: totalCount,
            items: postsOutput
        }
    }

    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string): Promise<paginatorPost | boolean> {
        try {

            const filter = { blogId: blogId }
            const posts = await PostsModelClass
                .find(filter)
                .sort([[paginationQuery.sortBy, paginationQuery.sortDirection]])
                .skip(paginationQuery.skip)
                .limit(paginationQuery.pageSize)
                .lean();

            const totalCount = await PostsModelClass.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / (paginationQuery.pageSize))
            const postsOutput: postOutput[] = posts.map((b) => {
                return {
                    id: b._id.toString(),
                    title: b.title,
                    shortDescription: b.shortDescription,
                    content: b.content,
                    blogId: b.blogId,
                    blogName: b.blogName,
                    createdAt: b.createdAt,
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None',
                        newestLikes: [{
                            addedAt: b.createdAt,
                            userId: 'string',
                            login: 'string'
                        }]
                    }
                }
            })
            return {
                pagesCount: pagesCount,
                page: paginationQuery.pageNumber,
                pageSize: paginationQuery.pageSize,
                totalCount: totalCount,
                items: postsOutput
            }
        } catch (e) { return false }

    }


    async getPostId(id: string, userId: string | null): Promise<postOutput | false> {
        try {
            let post = await PostsModelClass.findOne({ _id: new ObjectId(id) });
            if (!post) { return false }
            let myStatus = 'None'
            if (userId) {
                const user = await UsersModelClass.findOne({ _id: new ObjectId(userId) })
                const userStatus = await LikesPostsClass.findOne({ _id: id, userId: userId })
                if (userStatus) { myStatus = userStatus.status }
            }
            const newestLikes = await LikesPostsClass.find({ postId: id, status: 'Like' })
                .sort({ createdAt: -1 }).skip(3).lean()

            const newestLikesMaped: newestLikes[] = newestLikes.map((like) => {
                return {
                    addedAt: like.createdAt,
                    userId: like.userId,
                    login: like.login
                }
            })

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.extendedLikesInfo!.likesCount!,
                    dislikesCount: post.extendedLikesInfo!.dislikesCount!,
                    myStatus: myStatus,
                    newestLikes: newestLikesMaped
                }
            }
        } catch (e) { return false }
    }

    async deletePostId(id: string): Promise<boolean> {
        const postInstance = await PostsModelClass.findOne({ _id: new ObjectId(id) })
        if (!postInstance) { return false }

        await postInstance.deleteOne()
        return true
    }


    async createdPostId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput | false> {
        const blog = await this.blogsRepository.getBlogId(blogId);
        if (!blog) { return false }

        const newPostId = new ObjectId()
        const createdAt = new Date().toISOString();

        const newPost: PostMongoDb = {
            _id: newPostId,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [{
                    addedAt: createdAt,
                    userId: 'string',
                    login: 'string'
                }]
            }
        }

        const postInstance = new PostsModelClass(newPost)

        await postInstance.save()

        return {
            id: postInstance._id.toString(),
            title: postInstance.title,
            shortDescription: postInstance.shortDescription,
            content: postInstance.content,
            blogId: postInstance.blogId,
            blogName: postInstance.blogName,
            createdAt: postInstance.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [{
                    addedAt: createdAt,
                    userId: 'string',
                    login: 'string'
                }]
            }
        }

    }


    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        //const postInstance = await PostsModelClass.updateOne({_id: new ObjectId(id)}, {$set: {title , shortDescription, content, blogId}})    
        const postInstance = await PostsModelClass.findOne({ _id: new ObjectId(id) })
        if (!postInstance) return false
        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.save()
        return true
    }

    async updateLikeStatusPostId(postId: string, userId: string, likeStatus: string): Promise<boolean | null> {
        try {
            const login = await UsersModelClass.findOne({ _id: new ObjectId(userId) })
            const likeInstance = new LikesPostsClass()
            likeInstance._id = new ObjectId()
            likeInstance.userId = userId
            likeInstance.createdAt = (new Date()).toISOString()
            likeInstance.login = login!.accountData.login
            likeInstance.postId = postId
            likeInstance.status = likeStatus
            likeInstance.save()
            return true
        } catch (e) { return null }

    }

    async deletePostAll(): Promise<boolean> {
        const postInstance = await PostsModelClass.deleteMany({})
        if (!postInstance) { return false }
        return true
    }
}
