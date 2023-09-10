import { postOutput, blogOutput, blogMongoDB } from './../types/types-db';
import { ObjectId} from 'mongodb'
import mongoose, {Types} from 'mongoose'
import { paginatorPost } from '../types/types_paginator';



export const blogsShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
})

export const postsShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})


  export const accountDataShema = new mongoose.Schema ({
    login: {type: String, required: true},
    email: {type: String, required: true},
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    createdAt: {type: String, required: true}
})


export const emailConfirmationShema = new mongoose.Schema ({
    confirmationCode: {type: String, required: true},
    expiritionDate: {type: String, required: true},
    isConfirmed: {type: Boolean, required: true},
    recoveryCode: {type :String, required: true}
})

export const usersShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    accountData : {type: accountDataShema, required: true},
    emailConfirmation : {type: emailConfirmationShema, required: true}
})

export const userViewModelShema = new mongoose.Schema({
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const commentatorInfoShema =  new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
})

export const likeInfoShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    commentsId: {type: String, required: true},
    status: {type: String, required: true},
    createdAt:{type: String, required: true}
})



export const commentsShema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: commentatorInfoShema, required: true},
    createdAt:{type: String, required: true},
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    likes:{type: [likeInfoShema], required: true}
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

/*
export const paginatorBlogShema = new mongoose.Schema({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [blogOutputShema]}
})

export const paginatorPostShema = new mongoose.Schema<paginatorPost>({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [postOutputShema]}
})



export const paginatorUserShema = new mongoose.Schema({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [userViewModelShema]}
})

export const paginatorCommentsShema = new mongoose.Schema({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [commentViewModelShema]}
})

*/


