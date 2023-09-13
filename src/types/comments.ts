import { ObjectId } from "mongodb"

export type commentViewModel = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt:string,
    likesInfo : {
      likesCount: number,
      dislikesCount: number,
      myStatus: string
    }
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

  export type likeInfoShema = {
    _id: ObjectId,
    userId: string,
    commentsId: string,
    status: string,
    createdAt: string
}

  export class CommentMongoModel {
    constructor(
    public _id: ObjectId,
    public postId: string,
    public content: string,
    public commentatorInfo: {
        userId: string,
        userLogin: string
    },
    public createdAt:string,
    public likesCount: number,
    public dislikesCount: number,
    //public likes: likeInfoShema[]
    )
    {}
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