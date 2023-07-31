import { ObjectId } from "mongodb"

export type commentViewModel = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt:string
  }

  export type commentMongoModel = {
    _id: ObjectId,
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt:string
  }

  export type commentInputModel = {
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt:string
  }