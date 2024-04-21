import {CommentMongoModel, commentViewModel} from '../types/comments';
import {ObjectId} from "mongodb"
import {QueryPaginationType} from '../midlewares/pagination';
import {paginatorComments} from '../types/types_paginator';
import {CommentsModelClass, LikesModelClass} from '../db/db-mongoos';
import {LikeStatusEnum} from "../midlewares/like_status_validation";

export class CommentsRepository {
  async createdCommentPostId(postId: string, content: string, userId: string, userLogin: string, createdAt: string): Promise<commentViewModel> {
    const newCommentId = new ObjectId()

    const newComment: CommentMongoModel = {
      _id: newCommentId,
      postId: postId,
      content: content,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin
      },
      createdAt: createdAt,
      likesInfo: { likesCount: 0, dislikesCount: 0, myStatus: 'None' }
    }


    const commentsInstance = new CommentsModelClass(newComment)
    await commentsInstance.save()


    return {
      id: commentsInstance._id.toString(),
      content: commentsInstance.content,
      commentatorInfo: {
        userId: userId,
        userLogin: userLogin
      },
      createdAt: commentsInstance.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None'
      }
    }
  }

  async findCommentById(commentId: string, userId: string | null): Promise<commentViewModel | null> {
    try {
      const comment = await CommentsModelClass.findOne({ _id: new ObjectId(commentId) })
      if (!comment) {
        return null
      }

      let myStatus = 'None'

      if (userId) {
        const status = await LikesModelClass.findOne({ commentsId: commentId, userId })
        if (status) {
          myStatus = status.status
        }
      }
      const likeCount = await LikesModelClass.countDocuments({ commentsId: commentId, status: LikeStatusEnum.Like })
      const dislikesCount = await LikesModelClass.countDocuments({ commentsId: commentId, status: LikeStatusEnum.Dislike })
      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: likeCount,
          dislikesCount: dislikesCount,
          myStatus
        }
      }
    }
    catch (e) {
      return null
    }
  }

  async updateCommentId(commentsId: string, content: string): Promise<true | null> {
    try {
      const post = await CommentsModelClass.updateOne({ _id: new ObjectId(commentsId) }, { $set: { content } })
      if (post.matchedCount) {
        return true
      }
      else {
        return null
      }
    }
    catch (e) { return null }
  }

  async deletedCommentById(id: string): Promise<true | null> {
    try {
      const result = await CommentsModelClass.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount) {
        return true
      }
      else {
        return null
      }
    } catch (e) { return null }
  }

  async findCommentsByPostId(postId: string, userId: string | null, pagination: QueryPaginationType): Promise<paginatorComments | null> {
    try {
      const filter = { postId: postId }
      const comments = await CommentsModelClass.find(filter).
        sort([[pagination.sortBy, pagination.sortDirection]]).
        skip(pagination.skip).
        limit(pagination.pageSize).
        lean()
      const totalCount = await CommentsModelClass.countDocuments(filter)
      const pagesCount = Math.ceil(totalCount / pagination.pageSize)

      const mappedComments: commentViewModel[] = await Promise.all(comments.map(async c => {
        let myStatus = 'None'
        const commentsId = c._id.toString()

        if (userId) {
          const status = await LikesModelClass.findOne({ commentsId, userId })
          if (status) {
            myStatus = status.status
          }
        }
        return {
          id: commentsId,
          content: c.content,
          commentatorInfo: c.commentatorInfo,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: await LikesModelClass.countDocuments({ commentsId, status: LikeStatusEnum.Like }),
            dislikesCount: await LikesModelClass.countDocuments({ commentsId, status: LikeStatusEnum.Dislike }),
            myStatus: myStatus
          }
        }
      }))

      return {
        pagesCount: pagesCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
        items: mappedComments
      }
    } catch (e) { return null }
  }

  async updateLikeStatus(commentId: string, userId: string, likeStatus: string): Promise<boolean | null> {
    try {
      const comment = await CommentsModelClass.findOne({ _id: new ObjectId(commentId) })
      if (!comment) { return null }
      await LikesModelClass.updateOne(
        { commentsId: commentId, userId },
        { $set: { status: likeStatus, createdAt: new Date().toISOString() } },
        { upsert: true }
      )
      return true

    } catch (e) {
      console.log(e) 
      return null
     }
  }

  async deleteCommentsAll(): Promise<boolean> {
    await CommentsModelClass.deleteMany({});
    await LikesModelClass.deleteMany({});
    return true
  }
}

