import { CommentMongoModel, commentViewModel } from './../types/comments';
import { ObjectId } from "mongodb"
import { commentInputModel } from "../types/comments"
import { QueryPaginationType } from '../midlewares/pagination';
import { paginatorComments } from '../types/types_paginator';
import { CommentsModelClass } from '../db/db-mongoos';

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
      likes: [{
        _id: new ObjectId(),
        userId: userId,
        commentsId: (newCommentId).toString(),
        status: 'None',
        createdAt: (new Date()).toISOString()
      }]
    }
    const commentsInstance = new CommentsModelClass(newComment)
    commentsInstance._id = new ObjectId()
    await commentsInstance.save()

    return {
      id: commentsInstance._id.toString(),
      content: commentsInstance.content,
      commentatorInfo: commentsInstance.commentatorInfo,
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

      if (comment !== null) {

        const commentViewModel: commentViewModel = {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: comment.commentatorInfo,
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
            myStatus: comment.likes.filter((c) => {
                if (c.userId === userId) {return c.status}
            }).toString()
          }
        }
        return commentViewModel
      }
      else { return null }
    }
    catch (e) {return null }
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
    const commentsOutput : commentViewModel[] = comments.map((c) => {
      return {
        id: c._id.toString(),
        content: c.content,
        commentatorInfo: c.commentatorInfo,
        createdAt: c.createdAt,
        likesInfo: {
          likesCount: c.likesCount,
          dislikesCount: c.dislikesCount,
          myStatus: c.likes.filter((c) => {
              if (c.userId === userId) {return c.status}
          }).toString()
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
    const comment = await CommentsModelClass.findOne({_id: commentId})
    if (!comment) {return false}
    
    const like = comment.likes.find((c) => {
      c.userId === userId
    })
    
    if (!like) {return false} 
    const index = comment.likes.indexOf(like)

    if (like.status === likeStatus) {return true}
    else {
        if (like.status === 'None' &&  likeStatus ==='Like') {
            comment.likesCount += 1
            comment.likes.splice(index, 1)                 
            comment.likes.push({_id: new ObjectId(),
                            userId: userId,
                            commentsId: commentId,
                            createdAt: new Date().toISOString(),
                            status: 'Like'})
            await comment.save()
            return true
        }
        else if (like.status === 'None' && likeStatus ==='Dislike') {
                comment.dislikesCount += 1
                comment.likes.splice(index, 1)                 
                comment.likes.push({_id: new ObjectId(),
                            userId: userId,
                            commentsId: commentId,
                            createdAt: new Date().toISOString(),
                            status: 'Dislike'})
              await comment.save()
              return true
        }
        else if (like.status === 'Like' && likeStatus ==='Dislike') {
                comment.likesCount -= 1
                comment.dislikesCount += 1
                comment.likes.splice(index, 1)                 
                comment.likes.push({_id: new ObjectId(),
                          userId: userId,
                          commentsId: commentId,
                          createdAt: new Date().toISOString(),
                          status: 'Dislike'})
              await comment.save()
              return true
        }
        else if (like.status === 'Dislike' && likeStatus ==='Like') {
              comment.likesCount += 1
              comment.dislikesCount -= 1
              comment.likes.splice(index, 1)                 
              comment.likes.push({_id: new ObjectId(),
                          userId: userId,
                          commentsId: commentId,
                          createdAt: new Date().toISOString(),
                          status: 'Like'})
        await comment.save()
        return true
        }
        else {return null}
    }
  } catch (e) {return null}
  },

  async deleteCommentsAll() : Promise<boolean> {
    const deletResult = await CommentsModelClass.deleteMany({})
    return true
  }
}
