import { commentViewModel } from './../types/comments';
import { ObjectId } from "mongodb"
import { commentsCollections } from "../db/db-mongo"
import { commentInputModel } from "../types/comments"

export const commentsRepository = {
  async createdCommentPostId(comment: commentInputModel): Promise<commentViewModel> {
    const res = await commentsCollections.insertOne({ ...comment, _id: new ObjectId() })
    return {
      id: res.insertedId.toString(),
      ...comment
    }
  },

  async findCommentById(commentId: string): Promise<commentViewModel | null> {
    try {
      const comment = await commentsCollections.findOne({ _id: new ObjectId(commentId) })

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
      const post = await commentsCollections.updateOne({ _id: new ObjectId(commentsId) }, { $set: { content } })
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
      const result = await commentsCollections.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount) {
        return true
      }
      else {
        return null
      }
    } catch (e) { return null }
  }
}

