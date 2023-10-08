import { newestLikes } from './../types/types-posts';
import { QueryPaginationType } from './../midlewares/pagination';
import { ObjectId } from "mongodb";
import { paginatorPost } from "../types/types_paginator";
import { LikesPostsClass, PostsModelClass, UsersModelClass } from '../db/db-mongoos';
import { PostEntity, postOutput } from '../types/types-posts';
import { log } from 'console';
import { BlogsRepository } from './blogs-db-repository';
import {HydratedDocument} from 'mongoose'

export class PostRepository {
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
            const newestLikes = await LikesPostsClass.find({ postId: b.id, status: 'Like' }).sort({ createdAt: -1 }).limit(3).lean()
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
                    likesCount:  await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Like' }),
                    dislikesCount: await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Dislike' }),
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

    async findPostsBlogId(paginationQuery: QueryPaginationType, blogId: string, userId: string| null): Promise<paginatorPost | boolean> {
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
            const postsOutput: postOutput[] = await Promise.all(posts.map(async(b) => {
            let myStatus = 'None'
            if (userId) {
                const status = await LikesPostsClass.findOne({ userId, postId: b._id.toString() })
                if (status) {
                    myStatus = status.status
                }
            }
            const newestLikes = await LikesPostsClass.find({ postId: b._id.toString(), status: 'Like' }).sort({ createdAt: -1 }).limit(3).lean()
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
                        likesCount:  await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Like' }),
                        dislikesCount: await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Dislike' }),
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
        } catch (e) { return false }

    }

    async getPostById(id: string):Promise<HydratedDocument<PostEntity> | null> {
        //const post = await PostsModelClass.findOne({_id: id})
        return PostsModelClass.findOne({_id: id})
    }

    async savePost(post: HydratedDocument<PostEntity>) {
        await post.save()
     }

    async getPostId(id: string, userId: string | null): Promise<postOutput | false> {
        try {
            let post = await PostsModelClass.findOne({ _id: new ObjectId(id) }).lean();
            
            if (!post) { return false }
            let myStatus = 'None'
            if (userId) {
                const user = await UsersModelClass.findOne({ _id: new ObjectId(userId) })
                const userStatus = await LikesPostsClass.findOne({ postId: id, userId: userId })
                if (userStatus) { myStatus = userStatus.status }
            }
            const newestLikes = await LikesPostsClass.find({ postId: id, status: 'Like' }).sort({ createdAt: -1 }).limit(3).lean()
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
                    likesCount:  await LikesPostsClass.countDocuments({ postId: id, status: 'Like' }),
                    dislikesCount: await LikesPostsClass.countDocuments({ postId: id, status: 'Dislike' }),
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


    async createdPostId(title: string, shortDescription: string, content: string, blogId: string, blogName: string | boolean): Promise<postOutput | false> {
        if (blogName == false || blogName == true) { return false }

        const newPostId = new ObjectId()
        const createdAt = new Date().toISOString();

        const newPost: PostEntity = {
            _id: newPostId,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [
                ]
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
                newestLikes: []
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
            const createdAt = (new Date()).toISOString()
            const loginResult = await UsersModelClass.findOne({ _id: new ObjectId(userId) })
            const login = loginResult!.accountData.login
            const resultLikeStatus = await LikesPostsClass.findOne({userId: userId, postId: postId, status: likeStatus})
            if (resultLikeStatus) {return true}
            
            await LikesPostsClass.updateOne(
                { userId: userId, postId: postId},
                { $set: { login: login, status: likeStatus, createdAt: new Date().toISOString() } },
                { upsert: true }
            )


            // const likeInstance = new LikesPostsClass()
            // likeInstance._id = new ObjectId()
            // likeInstance.userId = userId
            // likeInstance.createdAt = createdAt
            // likeInstance.login = login!.accountData.login
            // likeInstance.postId = postId
            // likeInstance.status = likeStatus
            // likeInstance.save()

            const post = await PostsModelClass.findOne({ _id: new ObjectId(postId) })
            
            const newestLikes = await LikesPostsClass.find({ postId: postId, status: 'Like' })
                .sort({ createdAt: -1 })
                .limit(3)
                .lean()
            const newestLikesMaped: newestLikes[] = newestLikes.map((like) => {
                return {
                    addedAt: like.createdAt,
                    userId: like.userId,
                    login: like.login
                }
            })
            

            post!.extendedLikesInfo.newestLikes = newestLikesMaped
            
            // if (likeStatus === 'Like') {
            //     const newLike = {addedAt: createdAt,
            //         userId: userId,
            //         login: login!.accountData.login}
             
            //     if (post!.extendedLikesInfo.newestLikes.length < 3) {
            //         post!.extendedLikesInfo.newestLikes.unshift(newLike)
            //     } else {
            //         post!.extendedLikesInfo.newestLikes.pop()
            //         post!.extendedLikesInfo.newestLikes.unshift(newLike)
            //     }
            // }
            post!.save()
            
            return true
        } catch (e) { 
            return null
         }
    }

    async deletePostAll(): Promise<boolean> {
        const postInstance = await PostsModelClass.deleteMany({})
        if (!postInstance) { return false }
        return true
    }
}
