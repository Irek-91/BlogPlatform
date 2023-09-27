import { ObjectId, WithId } from "mongodb"
import mongoose from "mongoose"

export type User = {
    accountData : {
        login: string,
        email: string,
        salt: string,
        hash: string,
        createdAt: string
    },
    emailConfirmation : {
        confirmationCode: string,
        expiritionDate: any,
        isConfirmed: boolean,
        recoveryCode: string
    }
}

export type UserEncodePassword = {
    salt: string,
    hash: string
}

export type userMongoModel = {
    _id: ObjectId,
    accountData : {
        login: string,
        email: string,
        salt: string,
        hash: string,
        createdAt: string
    },
    emailConfirmation : {
        confirmationCode: string,
        expiritionDate: any,
        isConfirmed: boolean,
        recoveryCode: string
    }
} 

export class UserMongoModel {
    constructor(
        public _id: ObjectId,
        public accountData : {
            login: string,
            email: string,
            salt: string,
            hash: string,
            createdAt: string
        },
        public emailConfirmation : {
            confirmationCode: string,
            expiritionDate: any,
            isConfirmed: boolean,
            recoveryCode: string
        }
    ) 
    {}
}


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

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type userInputModel = {
    email: string,
    login: string,
    password: string,
}
export type userMeViewModel = {
    email: string,
    login: string,
    userId: ObjectId
}
export type loginInputModel = {
    loginOrEmail: string,
    password: string,
}

