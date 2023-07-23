export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type userMongoModel = {
    _id: string,
    login: string,
    email: string,
    createdAt: string
}

export type userInputModel = {
    login: string,
    password: string,
    email: string
}

export type userCreatModel = {
    login: string,
    email: string,
    createdAt: string
}
export type userCreatModelPassword = {
    login: string,
    email: string,
    salt: string,
    hash:string,
    createdAt: string
}
export type userPasswordSaltMongo = {
    _id: string,
    login: string,
    email: string,
    salt: string,
    hash:string,
    createdAt: string
}

export type loginInputModel = {
    loginOrEmail: string,
    password: string
}

