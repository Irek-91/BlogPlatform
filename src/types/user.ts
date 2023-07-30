import { ObjectId, WithId } from "mongodb"

export type User = {
    login: string,
    email: string,
    salt: string,
    hash: string,
    createdAt: string
}

export type UserEncodePassword = {
    salt: string,
    hash: string
}

export type userMongoModel = {
    _id: ObjectId,
    login: string,
    email: string,
    salt: string,
    hash: string,
    createdAt: string
} 

export type userCreatModel = Pick<User, 'login' | 'email' > & {password: string};

export type userViewModel = Pick<User, 'login' | 'email' | 'createdAt'> & {id: string}

export type userMeViewModel = {
    login: string,
    email: string,
    userId: object
}



