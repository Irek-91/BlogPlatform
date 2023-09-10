import { ObjectId, WithId } from "mongodb"

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


export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type userMeViewModel = {
    login: string,
    email: string,
    userId: object
}



