import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export type postInput = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type postInputModel = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
}

export type newestLikes = {
  addedAt: string,
  userId: string,
  login: string
}
export const newestLikesShema = new mongoose.Schema({
  addedAt:  {type: String, required: true},
  userId:  {type: String, required: true},
  login:  {type: String, required: true}
}, {_id: false})


export const postsShema = new mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, required: true},
  title: {type: String, required: true},
  shortDescription: {type: String, required: true},
  content: {type: String, required: true},
  blogId: {type: String, required: true},
  blogName: {type: String, required: true},
  createdAt: {type: String, required: true},
  extendedLikesInfo: { 
      likesCount: Number,
      dislikesCount: Number,
      myStatus: String,
      newestLikes: {type: [newestLikesShema], required: true}
  }
})

export const likePostInfoShema = new mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, required: true},
  userId: {type: String, required: true},
  login: {type: String, required: true},
  postId: {type: String, required: true},
  status: {type: String, required: true},
  createdAt:{type: String, required: true}
})



export class PostMongoDb {
  constructor(public _id: ObjectId,
              public title: string,
              public shortDescription: string,
              public content: string,
              public blogId: string,
              public blogName: string,
              public createdAt: string,
              public extendedLikesInfo: { 
                likesCount: number,
                dislikesCount: number,
                myStatus: string,
                newestLikes: newestLikes[]
              })
  {}

}

export type postMongoDb = {
  _id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
  extendedLikesInfo: { 
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: newestLikes[]
  }
};

export type postOutput = {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
  extendedLikesInfo: { 
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: newestLikes[]
  }
}
export type postsCollectionsType = postOutput[];

