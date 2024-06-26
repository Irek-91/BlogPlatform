import {QueryPaginationTypeUser} from '../midlewares/pagination-users';
import {User, userMongoModel, userViewModel,} from '../types/user';
import {Filter, ObjectId} from "mongodb";
import {UsersModelClass} from '../db/db-mongoos';


export class UserRepository {

  async findUsers(paginatorUser: QueryPaginationTypeUser) {
    const filter: Filter<userMongoModel> = {};
    if (paginatorUser.searchLoginTerm || paginatorUser.searchEmailTerm) {
      filter.$or = []
      if (paginatorUser.searchLoginTerm) {
        filter.$or.push({ 'accountData.login': { $regex: paginatorUser.searchLoginTerm, $options: 'i' } })
      }
      if (paginatorUser.searchEmailTerm) {
        filter.$or.push({ 'accountData.email': { $regex: paginatorUser.searchEmailTerm, $options: 'i' } })
      }

    }

    const users = await UsersModelClass.find().
      where(filter).
      sort([[paginatorUser.sortBy, paginatorUser.sortDirection]]).
      skip(paginatorUser.skip).
      limit(paginatorUser.pageSize).
      lean()
    const totalCount = await UsersModelClass.countDocuments([filter])
    const usersOutput: userViewModel[] = users.map((b) => {
      return {
        id: b._id.toString(),
        login: b.accountData!.login,
        email: b.accountData!.email,
        createdAt: b.accountData!.createdAt,
      }
    })

    return {
      pagesCount: Math.ceil(totalCount / paginatorUser.pageSize),
      page: paginatorUser.pageNumber,
      pageSize: paginatorUser.pageSize,
      totalCount: totalCount,
      items: usersOutput
    }
  }

  async createUser(newUser: User): Promise<userViewModel> {
    const userInstance = new UsersModelClass(newUser)
    userInstance._id = new ObjectId()

    await userInstance.save()

    return {
      id: userInstance._id.toString(),
      login: userInstance.accountData!.login,
      email: userInstance.accountData!.email,
      createdAt: userInstance.accountData!.createdAt
    }
  }

  async deleteUserId(id: string): Promise<boolean> {
    let user = await UsersModelClass.findOne({ _id: new ObjectId(id) })

    if (user) {
      try {
        await UsersModelClass.deleteOne({ _id: user._id })
        return true
      }
      catch (e) { return false }

    } else {
      return false
    }
  }



  async findByLoginOrEmailL(loginOrEmail: string): Promise<userMongoModel | false> {
    const user = await UsersModelClass.findOne({ $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.login': loginOrEmail }] }).lean()
    if (user === null) {
      return false
    }
    else {
      return user
    }
  }

  async deleteUserAll(): Promise<boolean> {
    await UsersModelClass.deleteMany({});
    return true
  }

  async findUserById(userId: ObjectId): Promise<userMongoModel | false> {
    try {
      let user = await UsersModelClass.findOne({ _id: userId });
      if (user === null) {
        return false
      }
      else {
        return user
      }
    } catch (e) { return false }
  }

  async findUserByCode(code: string): Promise<userMongoModel | null> {
    try {
      return await UsersModelClass.findOne({"emailConfirmation.confirmationCode": code}).lean()
    }
    catch (e) { return null }
  }

  async updateConfirmation(_id: ObjectId): Promise<boolean> {
    let result = await UsersModelClass.updateOne({ _id }, { $set: { "emailConfirmation.isConfirmed": true } })
    return result.modifiedCount === 1
  }

  async findUserByEmail(email: string): Promise<userMongoModel | null> {
    try {
      return await UsersModelClass.findOne({"accountData.email": email}).lean()
    }
    catch (e) { return null }
  }

  async findUserByLogin(login: string): Promise<userMongoModel | null> {
    try {
      return await UsersModelClass.findOne({"accountData.login": login}).lean()
    }
    catch (e) { return null }
  }

  async updateCode(_id: ObjectId, code: string, expiritionDate: Date): Promise<boolean> {
    let result = await UsersModelClass.updateOne({ _id }, { $set: { "emailConfirmation.confirmationCode": code, "emailConfirmation.expiritionDate": expiritionDate } })
    return result.modifiedCount === 2
  }

  async updatePassword(_id: ObjectId, salt: string, hash: string): Promise<boolean> {
    let result = await UsersModelClass.updateOne({ _id }, { $set: { "accountData.salt": salt, "accountData.hash": hash } })
    return result.modifiedCount === 1
  }

  async updateRecoveryCode(_id: ObjectId, recoveryCode: string): Promise<boolean> {
    let result = await UsersModelClass.updateOne({ _id }, { $set: { "emailConfirmation.recoveryCode": recoveryCode } })
    return result.modifiedCount === 1
  }

  async findUserByRecoveryCode(recoveryCode: string): Promise<userMongoModel | null> {
    try {
      return await UsersModelClass.findOne({"emailConfirmation.recoveryCode": recoveryCode}).lean()
    }
    catch (e) {
      return null
    }
  }
}
