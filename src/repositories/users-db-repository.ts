import { log } from 'console';
import { QueryPaginationTypeUser } from '../midlewares/pagination-users';
import { User, userMeViewModel, userMongoModel, userViewModel, } from '../types/user';
import { Filter, ObjectId } from "mongodb";
import { UsersModelClass } from '../db/db-mongoos';



export const userRepository = {

    async findUsers(paginatorUser: QueryPaginationTypeUser) {
      const filter: Filter<userMongoModel> = {};
      // const filter = {
      //   $or: [{login: { $regex: paginatorUser.searchLoginTerm, $options: 'i' }

      //   ]
      // }

      if (paginatorUser.searchLoginTerm || paginatorUser.searchEmailTerm) {
        filter.$or = []
          if (paginatorUser.searchLoginTerm) {
            filter.$or.push( {'accountData.login': { $regex: paginatorUser.searchLoginTerm, $options: 'i' }})
          }
          if (paginatorUser.searchEmailTerm) {
            filter.$or.push( {'accountData.email': { $regex: paginatorUser.searchEmailTerm, $options: 'i' }})
          }

      }
            
      const users = await UsersModelClass.find().
                                where(filter).
                                sort([[paginatorUser.sortBy,paginatorUser.sortDirection]]).
                                skip(paginatorUser.skip).
                                limit(paginatorUser.pageSize).
                                lean()
      const totalCount = await UsersModelClass.countDocuments([filter])                    
      const usersOutput: userViewModel[] =  users.map((b) => {
            return {
              id: b._id.toString(),
              login: b.accountData!.login,
              email: b.accountData!.email,
              createdAt: b.accountData!.createdAt,
            }
        })
  
        return {
            pagesCount: Math.ceil(totalCount/paginatorUser.pageSize),
            page: paginatorUser.pageNumber,
            pageSize: paginatorUser.pageSize,
            totalCount: totalCount,
            items: usersOutput
          }
        },
        
    async createUser(newUser:User): Promise<userViewModel> {
            //const res = await UsersModelClass.insertMany({...newUser, _id: new ObjectId()})
            const userInstance = new UsersModelClass(newUser)
            userInstance._id = new ObjectId()

            await userInstance.save()

            const userViewVodel = {
              id: userInstance._id.toString(),
              login: userInstance.accountData!.login,
              email: userInstance.accountData!.email,
              createdAt: userInstance.accountData!.createdAt
            }
            return userViewVodel        
          },

    async deleteUserId(id: string):Promise<boolean> {
            let user = await UsersModelClass.findOne({_id: new ObjectId(id)})

            if (user) {
                try {
                    await UsersModelClass.deleteOne({_id: user._id})
                    return true}
                catch (e) 
                    {return false}
            
            } else {
                return false
                 }
    },



    async findByLoginOrEmailL(loginOrEmail: string): Promise<userMongoModel | false> {
        const user  = await UsersModelClass.findOne({$or: [{'accountData.email': loginOrEmail }, {'accountData.login': loginOrEmail}]}).lean()
        if (user === null) {
          return false
        }
        else {
          return user
        }
    },


    async deleteUserAll() : Promise<boolean> {
      const deletResult = await UsersModelClass.deleteMany({})
      return true
    },
    
    async findUserById(userId: ObjectId) : Promise<userMongoModel | false> {
      try {let user =  await UsersModelClass.findOne({_id: userId});
      if (user === null)
      {
          return false
      }
       else
      {
        return user
      }
      } catch (e) {return false}
    },

    async findUserByCode(code: string): Promise<userMongoModel | null> {
      try {let user = await UsersModelClass.findOne({"emailConfirmation.confirmationCode": code}).lean()
      return user}
      catch (e) {return null}
    },

    async updateConfirmation(_id: ObjectId): Promise<boolean> {
      let result = await UsersModelClass.updateOne({_id}, {$set : {"emailConfirmation.isConfirmed": true}})
      return result.modifiedCount === 1
    },

    async findUserByEmail(email: string): Promise<userMongoModel | null>{
      try {let user = await UsersModelClass.findOne({"accountData.email": email}).lean()
      return user}
      catch (e) {return null}
    },
    async findUserByLogin(login: string): Promise<userMongoModel | null>{
      try {let user = await UsersModelClass.findOne({"accountData.login": login}).lean()
      return user}
      catch (e) {return null}
    },

    async updateCode(_id: ObjectId, code: string, expiritionDate: Date): Promise<boolean> {
      let result = await UsersModelClass.updateOne({_id}, {$set : {"emailConfirmation.confirmationCode": code, "emailConfirmation.expiritionDate" : expiritionDate}})
      return result.modifiedCount === 2
    },

    async updatePassword(_id: ObjectId, salt: string, hash: string): Promise<boolean> {
      let result = await UsersModelClass.updateOne({_id}, {$set : {"accountData.salt": salt, "accountData.hash" : hash}})
      return result.modifiedCount === 2
    },
    async updateRecoveryCode(_id: ObjectId, recoveryCode: string): Promise<boolean> {
      let result = await UsersModelClass.updateOne({_id}, {$set : {"emailConfirmation.recoveryCode": recoveryCode}})
      return result.modifiedCount === 1
    },
    async findUserByRecoveryCode(recoveryCode: string): Promise<userMongoModel | null> {
      try {let user = await UsersModelClass.findOne({"emailConfirmation.recoveryCode": recoveryCode}).lean()
      return user}
      catch (e) {return null}
    },
    /*async addNewAccessToken(userId: ObjectId, accessToken: string): Promise<boolean | null>{
      try {let result = await usersCollections.updateOne({_id: userId}, {$set: {'tokens.accessToken': accessToken}})
      return result.matchedCount === 1}
      catch (e) {return null}
    },
    async addNewrefreshToken(userId: ObjectId, refreshToken: string): Promise<boolean | null>{
      try {let result = await usersCollections.updateOne({_id: userId}, {$set: {'tokens.refreshToken': refreshToken}})
      return result.matchedCount === 1}
      catch (e) {return null}
    },

    async findAccesTokenByRefreshToken(refreshToken :string): Promise<userMongoModel | null>{
      try {let user = await usersCollections.findOne({"tokens.refreshToken": refreshToken})
          if (user) {return user}
          else {return null}
      }
      catch (e) {return null}
    }
    */
    
}
