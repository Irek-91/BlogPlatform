import mongoose from 'mongoose';
import { CommentMongoModel } from '../types/comments';


export const commentatorInfoShema =  new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
}, {_id: false})

export const likeInfoShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    commentsId: {type: String, required: true},
    status: {type: String, required: true},
    createdAt:{type: String, required: true}
})


export const commentsShema = new mongoose.Schema<CommentMongoModel>({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: commentatorInfoShema, required: true},
    createdAt:{type: String, required: true},
    likesInfo: { 
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
      }
    //likes:{type: [likeInfoShema], required: true}
})



export const DevicesModelClassShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    issuedAt: {type: String, required: true},
    expirationDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    IP: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true}
})

export const IPAndURIShema = new mongoose.Schema({
    IP:{type: String, required: true}, 
    URL:{type: String, required: true},
    date:{type: String, required: true}
})



