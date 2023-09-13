import { ObjectId } from 'mongodb';
import { QueryPaginationType } from "../midlewares/pagination";
import { commentsRepository } from "../repositories/comments-db-repository";
import { userRepository } from "../repositories/users-db-repository";
import { commentViewModel } from "../types/comments";
import { paginatorComments } from "../types/types_paginator";
import { jwtService } from '../application/jwt-service';
import { log } from 'console';

export class CommentsService {
    async createdCommentPostId(postId: string, userId: string, content: string): Promise<commentViewModel | null> {

        const createdAt = new Date().toISOString();
        const user = await userRepository.findUserById(new ObjectId(userId))
        if (!user) {
            return null
        }
        const userLogin = user.accountData.login
        const creatComment = await commentsRepository.createdCommentPostId(postId, content, userId, userLogin, createdAt)
        return creatComment
    }

    async findCommentById(commentId: string, userId: string): Promise<commentViewModel | null> {
        const comment = await commentsRepository.findCommentById(commentId, userId)
        if (comment === null) {
            return null
        }
        else {
            return comment
        }
    }
    async updateContent(userId: string, commentsId: string, content: string): Promise<null | false | true> {
        try {
            const comment = await commentsRepository.findCommentById(commentsId, userId)
            if (comment!.commentatorInfo.userId === userId) {
                const result = await commentsRepository.updateCommentId(commentsId, content)
                return result
            }
            else {
                return false
            }
        } catch (e) { return null }
    }


    async deleteCommentById(commentsId: string, userId: string): Promise<true | null | false> {

        try {
            const commentById = await commentsRepository.findCommentById(commentsId, userId)
            if (commentById === null) { 
                return null }
            if (commentById.commentatorInfo.userId === userId) {
                const result = await commentsRepository.deletCommentById(commentsId)
                return result
            }
            else {
                return false
            }
        } catch (e) { return null }
    }

    async findCommentsByPostId(postId: string, userId: string, pagination: QueryPaginationType): Promise<paginatorComments | null> {
        return commentsRepository.findCommentsByPostId(postId, userId, pagination)
    }

    async updateLikeStatus(commentId: string, userId:string, likeStatus:string): Promise<Boolean | null> {
        return commentsRepository.updateLikeStatus(commentId, userId, likeStatus)
    }
}

//export const commentsService = new CommentsService()