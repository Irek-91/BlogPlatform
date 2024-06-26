import {paginatorUser} from '../types/types_paginator';
import {QueryPaginationTypeUser} from "../midlewares/pagination-users"
import {userMeViewModel, UserMongoModel, userMongoModel, userViewModel,} from "../types/user"
import bcrypt from 'bcrypt'
import {ObjectId} from 'mongodb';
import {add} from 'date-fns';
import {v4 as uuidv4} from 'uuid';
import {UserRepository} from '../repositories/users-db-repository';


export class UsersService {
  constructor (protected userRepository: UserRepository) { }
  async findUsers(paginationQuery: QueryPaginationTypeUser): Promise<paginatorUser> {
    return await  this.userRepository.findUsers(paginationQuery)
  }

  async createUser(loginUser: string, passwordUser: string, emailUser: string): Promise<userViewModel> {
    const createdAt = new Date().toISOString();
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(passwordUser, passwordSalt)
    const confirmationCode = uuidv4()
    const recoveryCode = uuidv4()
    const isConfirmed = false
    const expiritionDate = (add(new Date(), {
      hours: 1,
      minutes: 3
    })).toISOString()

    const newUser = new UserMongoModel(new ObjectId(),
      {
        login: loginUser,
        email: emailUser,
        salt: passwordSalt,
        hash: passwordHash,
        createdAt
      },
      {
        confirmationCode,
        expiritionDate,
        isConfirmed,
        recoveryCode
      })
      
    return await  this.userRepository.createUser(newUser)
  }

  async deleteUserId(id: string) {
    return await  this.userRepository.deleteUserId(id)
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt)
    return hash;
  }

  async checkCredentials(loginOrEmail: string, passwordUser: string): Promise<userMongoModel | false> {
    const user = await  this.userRepository.findByLoginOrEmailL(loginOrEmail)
    if (!user) {
      return false
    }
    const passwordHash = await this._generateHash(passwordUser, user.accountData.salt)
    if (user.accountData.hash !== passwordHash) {
      return false
    }
    else {
      return user
    }
  }


  async deleteUserAll(): Promise<boolean> {
    return await  this.userRepository.deleteUserAll()
  }

  async findByUserId(userId: ObjectId): Promise<userMeViewModel | false> {

    const result = await  this.userRepository.findUserById(userId)
    if (result) {
      return {
        email: result.accountData.email,
        login: result.accountData.login,
        userId: result._id
      }
    }
    return false
  }

  async findUserByCode(code: string): Promise<userMongoModel | null> {
    return await this.userRepository.findUserByCode(code)
  }

  async findUserByEmail(email: string): Promise<userMongoModel | null> {
    return await this.userRepository.findUserByEmail(email)
  }
}
