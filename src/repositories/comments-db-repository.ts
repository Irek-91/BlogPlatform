import { CommentMongoModel, commentViewModel, likeInfoShema } from './../types/comments';
import { ObjectId } from "mongodb"
import { commentInputModel } from "../types/comments"
import { QueryPaginationType } from '../midlewares/pagination';
import { paginatorComments } from '../types/types_paginator';
import { CommentsModelClass, LikesModelClass } from '../db/db-mongoos';
import { log } from 'console';

export const commentsRepository = {
  async createdCommentPostId(postId: string, content:string, userId:string, userLogin:string, createdAt:string): Promise<commentViewModel> {
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
  },

  async findCommentById(commentId: string, userId: string | null): Promise<commentViewModel | null> {
    try {
      const comment = await CommentsModelClass.findOne({ _id: new ObjectId(commentId) })
      if (!comment) {
        return null}

      let myStatus = 'None'

      if(userId){
        const status = await LikesModelClass.findOne({commentsId: commentId, userId})
        if(status) {
          myStatus = status.status
        }
      }
      const likeCount = await LikesModelClass.countDocuments({commentsId:commentId, status: 'Like'})
      const dislikesCount = await LikesModelClass.countDocuments({commentsId:commentId, status: 'Dislike'})
      const commentViewModel: commentViewModel = {
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
        return commentViewModel
    }
    catch (e) {
      return null }
  },


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
  },

  async deletCommentById(id: string): Promise<true | null> {
    try {
      const result = await CommentsModelClass.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount) {
        return true
      }
      else {
        return null
      }
    } catch (e) { return null }
  },

  async findCommentsByPostId(postId: string, userId: string | null, pagination: QueryPaginationType): Promise<paginatorComments | null> {
    try{
    const filter = {postId: postId}
    const comments = await CommentsModelClass.find(filter).
                                              sort([[pagination.sortBy, pagination.sortDirection]]).
                                              skip(pagination.skip).
                                              limit(pagination.pageSize).
                                              lean()
    log(comments)
    const totalCOunt = await CommentsModelClass.countDocuments(filter)
    const pagesCount = Math.ceil(totalCOunt/pagination.pageSize)

    const mappedComments: commentViewModel[] = await Promise.all(comments.map(async c => {
      let myStatus = 'None'
      const commentsId = c._id.toString()

      if(userId){
        const status = await LikesModelClass.findOne({commentsId, userId})
        if(status) {
          myStatus = status.status
        }
      }
      return {
        id: commentsId,
        content: c.content,
        commentatorInfo: c.commentatorInfo,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: await LikesModelClass.countDocuments({commentsId, status: 'Like'}),
          dislikesCount: await LikesModelClass.countDocuments({commentsId, status: 'Dislike'}),
          myStatus: myStatus
      }
    }}))
   
    return {pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCOunt,
      items: mappedComments
    }                                        
  } catch (e) {return null}
  },

  async updateLikeStatus(commentId:string, userId:string, likeStatus:string): Promise<boolean | null> {
    try{ 
    const comment = await CommentsModelClass.findOne({_id: new ObjectId(commentId)})
    if (!comment) {return null}
    await LikesModelClass.updateOne(
      {commentsId: commentId, userId},
      {$set: {status: likeStatus, createdAt: new Date().toISOString()}},
      {upsert: true}
    )
    return true
    
  } catch (e) {return null}
  },

  async deleteCommentsAll() : Promise<boolean> {
    const deletResult = await CommentsModelClass.deleteMany({})
    const deletResult1 = await LikesModelClass.deleteMany({})
    return true
  }
}

