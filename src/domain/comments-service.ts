import { commentsRepository } from "../repositories/comments-db-repository";
import { userRepository } from "../repositories/users-db-repository";
import { commentInputModel, commentViewModel } from "../types/comments";
import { postOutput } from "../types/types-db";

export const commentsService = {
    async createdCommentPostId(post: postOutput, userId: string, content: string): Promise<commentViewModel | null> {

        const createdAt = new Date().toISOString();
        const user = await userRepository.findUserById(userId)
        if (!user) {
            return null
        }

        const newComment: commentInputModel = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },
            createdAt: createdAt
        };
        const creatComment = await commentsRepository.createdCommentPostId(newComment)
        return creatComment
    },

    async findCommentById(id: string): Promise<commentViewModel | null> {
        const comment = await commentsRepository.findCommentById(id)
        if (comment === null) {
            return null
        }
        else {
            return comment
        }
    },
    async updateContent(userId: string, commentsId: string, content: string): Promise<null | false | true> {
        try {
            const comment = await commentsRepository.findCommentById(commentsId)
            if (comment!.commentatorInfo.userId === userId) {
                const result = await commentsRepository.updateCommentId(commentsId, content)
                return result
            }
            else {
                return false
            }
        } catch (e) { return null }
    },


    async deleteCommentById(commentsId: string, userId: string): Promise<true | null | false> {

        try {
            const commentById = await commentsRepository.findCommentById(commentsId)
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



}