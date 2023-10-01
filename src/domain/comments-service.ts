import { ObjectId } from 'mongodb';
import { QueryPaginationType } from "../midlewares/pagination";
import { commentViewModel } from "../types/comments";
import { paginatorComments } from "../types/types_paginator";
import { jwtService } from '../application/jwt-service';
import { log } from 'console';
import { UserRepository } from '../repositories/users-db-repository';
import { CommentsRepository } from '../repositories/comments-db-repository';

export class CommentsService {
    constructor(protected userRepository: UserRepository, protected commentsRepository: CommentsRepository) {}

    async createdCommentPostId(postId: string, userId: string, content: string): Promise<commentViewModel | null> {

        const createdAt = new Date().toISOString();
        const user = await this.userRepository.findUserById(new ObjectId(userId))
        if (!user) {
            return null
        }
        const userLogin = user.accountData.login
        const creatComment = await this.commentsRepository.createdCommentPostId(postId, content, userId, userLogin, createdAt)
        return creatComment
    }

    async findCommentById(commentId: string, userId: string | null): Promise<commentViewModel | null> {

        const comment = await this.commentsRepository.findCommentById(commentId, userId)
        if (comment === null) {
            return null
        }
        else {
            return comment
        }
    }
    async updateContent(userId: string, commentsId: string, content: string): Promise<null | false | true> {
        try {
            const comment = await this.commentsRepository.findCommentById(commentsId, userId)
            if (comment!.commentatorInfo.userId === userId) {
                const result = await this.commentsRepository.updateCommentId(commentsId, content)
                return result
            }
            else {
                return false
            }
        } catch (e) { return null }
    }


    async deleteCommentById(commentsId: string, userId: string): Promise<true | null | false> {

        try {
            const commentById = await this.commentsRepository.findCommentById(commentsId, userId)
            if (commentById === null) {
                return null
            }
            if (commentById.commentatorInfo.userId === userId) {
                const result = await this.commentsRepository.deletCommentById(commentsId)
                return result
            }
            else {
                return false
            }
        } catch (e) { return null }
    }

    async findCommentsByPostId(postId: string, userId: string | null, pagination: QueryPaginationType): Promise<paginatorComments | null> {
        return this.commentsRepository.findCommentsByPostId(postId, userId, pagination)
    }

    async updateLikeStatus(commentId: string, userId: string, likeStatus: string): Promise<Boolean | null> {
        return this.commentsRepository.updateLikeStatus(commentId, userId, likeStatus)
    }
}

//export const commentsService = new CommentsService()