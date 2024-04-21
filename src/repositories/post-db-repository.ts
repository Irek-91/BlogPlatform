import { newestLikes } from '../types/types-posts';
import { QueryPaginationType } from '../midlewares/pagination';
import { ObjectId } from "mongodb";
import { paginatorPost } from "../types/types_paginator";
import { LikesPostsClass, PostsModelClass, UsersModelClass } from '../db/db-mongoos';
import { PostEntity, postOutput } from '../types/types-posts';
import {HydratedDocument} from 'mongoose'
import {newestLikesMapped} from "../maped/newestLikesMapped";
import {likesTypeDB} from "../types/type-likes";
import {LikeStatusEnum} from "../midlewares/like_status_validation";

export class PostRepository {
    async findPost(paginationQuery: QueryPaginationType, userId: string | null): Promise<paginatorPost> {
        const posts = await PostsModelClass.find({}).
            sort([[paginationQuery.sortBy, paginationQuery.sortDirection]]).
            skip(paginationQuery.skip).
            limit(paginationQuery.pageSize)
        const totalCount = await PostsModelClass.countDocuments()
        const pagesCount = Math.ceil(totalCount / paginationQuery.pageSize)

        const postsOutput: postOutput[] = await Promise.all(posts.map(async (b) => {
            let myStatus: string = LikeStatusEnum.None
            if (userId) {
                const status = await LikesPostsClass.findOne({ userId, postId: b._id.toString() })
                if (status) {
                    myStatus = status.status
                }
            }
            const newestLikesSort: likesTypeDB[] = await LikesPostsClass.find({ postId: b.id, status: LikeStatusEnum.Like })
                .sort({ createdAt: -1 }).
                limit(3).
                lean()
            const likesMapped: newestLikes[]  = newestLikesMapped(newestLikesSort)

            return {
                id: b._id.toString(),
                title: b.title,
                shortDescription: b.shortDescription,
                content: b.content,
                blogId: b.blogId,
                blogName: b.blogName,
                createdAt: b.createdAt,
                extendedLikesInfo: {
                    likesCount:  await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: LikeStatusEnum.Like }),
                    dislikesCount: await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: LikeStatusEnum.Dislike }),
                    myStatus: myStatus,
                    newestLikes: likesMapped
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
                let myStatus: string = LikeStatusEnum.None
            if (userId) {
                const status = await LikesPostsClass.findOne({ userId, postId: b._id.toString() })
                if (status) {
                    myStatus = status.status
                }
            }
                const newestLikesSort: likesTypeDB[] = await LikesPostsClass.find({ postId: b._id.toString(), status: LikeStatusEnum.Like})
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .lean()
                const likesMapped: newestLikes[]  = newestLikesMapped(newestLikesSort)

                return {
                    id: b._id.toString(),
                    title: b.title,
                    shortDescription: b.shortDescription,
                    content: b.content,
                    blogId: b.blogId,
                    blogName: b.blogName,
                    createdAt: b.createdAt,
                    extendedLikesInfo: {
                        likesCount:  await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: LikeStatusEnum.Like }),
                        dislikesCount: await LikesPostsClass.countDocuments({ postId: b._id.toString(), status: LikeStatusEnum.Dislike }),
                        myStatus: myStatus,
                        newestLikes: likesMapped
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
        return PostsModelClass.findOne({_id: id})
    }

    async savePost(post: HydratedDocument<PostEntity>) {
        await post.save()
     }

    async getPostId(id: string, userId: string | null): Promise<postOutput | false> {
        try {
            let post = await PostsModelClass.findOne({ _id: new ObjectId(id) }).lean();
            
            if (!post) { return false }
            let myStatus: string = LikeStatusEnum.None
            if (userId) {
                const user = await UsersModelClass.findOne({ _id: new ObjectId(userId) })
                const userStatus = await LikesPostsClass.findOne({ postId: id, userId: userId })
                if (userStatus) { myStatus = userStatus.status }
            }
            const newestLikesSort: likesTypeDB[] = await LikesPostsClass.find({ postId: id, status: LikeStatusEnum.Like })
                .sort({ createdAt: -1 })
                .limit(3)
                .lean()
            const likesMapped: newestLikes[]  = newestLikesMapped(newestLikesSort)

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount:  await LikesPostsClass.countDocuments({ postId: id, status: LikeStatusEnum.Like }),
                    dislikesCount: await LikesPostsClass.countDocuments({ postId: id, status: LikeStatusEnum.Dislike }),
                    myStatus: myStatus,
                    newestLikes: likesMapped
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
                myStatus: LikeStatusEnum.None,
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
                myStatus: LikeStatusEnum.None,
                newestLikes: []
            }
        }

    }

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
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


            const post = await PostsModelClass.findOne({ _id: new ObjectId(postId) })

            const newestLikesSort: likesTypeDB[] = await LikesPostsClass.find({ postId: postId, status: LikeStatusEnum.Like})
                .sort({ createdAt: -1 })
                .limit(3)
                .lean()
            post!.extendedLikesInfo.newestLikes = newestLikesMapped(newestLikesSort)
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
