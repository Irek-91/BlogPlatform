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
        isConfirmed: boolean
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
        isConfirmed: boolean
    }
    /*tokens : {
        accessToken: string,
        refreshToken: string
    }*/

} 

//export type userCreatModel = Pick<User, 'login' | 'email' > & {password: string};

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



