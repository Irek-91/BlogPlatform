import { commentViewModel } from './../types/comments';
import { ObjectId } from "mongodb"
import { commentInputModel } from "../types/comments"
import { QueryPaginationType } from '../midlewares/pagination';
import { paginatorComments } from '../types/types_paginator';
import { CommentsModelClass } from '../db/db-mongoos';

export const commentsRepository = {
  async createdCommentPostId(comment: commentInputModel): Promise<commentViewModel> {
    //const res = await CommentsModelClass.insertMany({ ...comment, _id: new ObjectId()})
    const commentsInstance = new CommentsModelClass(comment)
    commentsInstance._id = new ObjectId()
    await commentsInstance.save()

    return {
      id: commentsInstance._id.toString(),
      content: commentsInstance.content,
      commentatorInfo: commentsInstance.commentatorInfo,
      createdAt: commentsInstance.createdAt
    }
  },

  async findCommentById(commentId: string): Promise<commentViewModel | null> {
    try {
      const comment = await CommentsModelClass.findOne({ _id: new ObjectId(commentId) })

      if (comment !== null) {

        const commentViewModel = {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: comment.commentatorInfo,
          createdAt: comment.createdAt
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

  async findCommentsByPostId(postId: string, pagination: QueryPaginationType): Promise<paginatorComments | null> {
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
        createdAt: c.createdAt
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
  async deleteCommentsAll() : Promise<boolean> {
    const deletResult = await CommentsModelClass.deleteMany({})
    return true
  }
}
