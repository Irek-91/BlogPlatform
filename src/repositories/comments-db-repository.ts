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
      createdAt:createdAt,
      likesCount: 0,
      dislikesCount: 0,
    }
    const newLike: likeInfoShema = {
      _id: new ObjectId(),
      userId: userId,
      commentsId: newCommentId.toString(),
      status: 'None',
      createdAt: new Date().toISOString()

    }
    
    const commentsInstance = new CommentsModelClass(newComment)
    const newLikeInstance = new LikesModelClass(newLike)
    await commentsInstance.save()
    await newLikeInstance.save()


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

  async findCommentById(commentId: string, userId: string): Promise<commentViewModel | null> {
    try {
      const comment = await CommentsModelClass.findOne({ _id: new ObjectId(commentId) })
      if (!comment) {
        return null}
      let myStatusLike = 'None'

    
      const like = await LikesModelClass.findOne({userId: userId, commentsId: commentId})
      if (like) {
        myStatusLike = like.status
      }
      const likeCount = await LikesModelClass.countDocuments({commentsId:commentId, status: 'Like'})
      const dislikesCount = await LikesModelClass.countDocuments({commentsId:commentId, status: 'Dislikes'})

      const commentViewModel: commentViewModel = {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: comment.commentatorInfo,
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: likeCount,
            dislikesCount: dislikesCount,
            myStatus: myStatusLike
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

  async findCommentsByPostId(postId: string, userId: string, pagination: QueryPaginationType): Promise<paginatorComments | null> {
    try{
    const filter = {postId: postId}
    const comments = await CommentsModelClass.find(filter).
                                              sort([[pagination.sortBy, pagination.sortDirection]]).
                                              skip(pagination.skip).
                                              limit(pagination.pageSize).
                                              lean()
                                              
    const totalCOunt = await CommentsModelClass.countDocuments(filter)
    const pagesCount = Math.ceil(totalCOunt/pagination.pageSize)
    const like = await LikesModelClass.find({userId: userId}).lean()
    const commentsOutput : commentViewModel[] = comments.map((c) => {
      
      return {
        id: c._id.toString(),
        content: c.content,
        commentatorInfo: c.commentatorInfo,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: c.likesCount,
          dislikesCount: c.dislikesCount,
          myStatus: (like.filter((like)=> { if (like.commentsId === (c._id).toString() && like.userId === userId) {return like.status} else {return 'None'}})).toString()
        }
      }
    }
    )

    return {pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCOunt,
      items : commentsOutput
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

