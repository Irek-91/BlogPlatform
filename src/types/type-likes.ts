import {ObjectId} from "mongodb";

export type likesTypeDB = {
    _id: ObjectId,
    login: string
    userId: string,
    postId: string,
    commentsId: string,
    status: string,
    createdAt:string
}