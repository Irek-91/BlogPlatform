import { log } from 'console';
import { usersCollections } from '../db/db-mongo';
import { QueryPaginationTypeUser } from '../midlewares/pagination-users';
import { User, userMeViewModel, userMongoModel, userViewModel, } from '../types/user';
import { Filter, ObjectId } from "mongodb";



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
      
      const users = await usersCollections.find(filter).
                                sort(paginatorUser.sortBy,paginatorUser.sortDirection).
                                skip(paginatorUser.skip).
                                limit(paginatorUser.pageSize).
                                toArray();
      const totalCount = await usersCollections.countDocuments(filter)                    
      const usersOutput =  users.map((b) => {
            return {
              id: b._id.toString(),
              login: b.accountData.login,
              email: b.accountData.email,
              createdAt: b.accountData.createdAt,
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
            const res = await usersCollections.insertOne({...newUser, _id: new ObjectId()})
            const userViewVodel = {
              id: res.insertedId.toString(),
              login: newUser.accountData.login,
              email: newUser.accountData.email,
              createdAt: newUser.accountData.createdAt
            }
            return userViewVodel        
          },

    async deleteUserId(id: string):Promise<boolean> {
            let user = await usersCollections.findOne({_id: new ObjectId(id)})

            if (user) {
                try {
                    await usersCollections.deleteOne({_id: user._id})
                    return true}
                catch (e) 
                    {return false}
            
            } else {
                return false
                 }
    },



    async findByLoginOrEmailL(loginOrEmail: string): Promise<userMongoModel | false> {
        const user  = await usersCollections.findOne({$or: [{'accountData.email': loginOrEmail }, {'accountData.login': loginOrEmail}]})
        if (user === null) {
          return false
        }
        else {
          return user
        }
    },
    async findByEmailL(email: string): Promise<userMongoModel | false> {
      const user  = await usersCollections.findOne({'accountData.email': email })
      if (user === null) {
        return false
      }
      else {
        return user
      }
  },


    async deleteUserAll() : Promise<boolean> {
      const deletResult = await usersCollections.deleteMany({})
      return true
    },
    
    async findUserById(userId: string) : Promise<userMongoModel | false> {
      try {let user =  await usersCollections.findOne({_id: new ObjectId(userId)});
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
      try {let user = await usersCollections.findOne({"emailConfirmation.confirmationCode": code})
      return user}
      catch (e) {return null}
    },

    async updateConfirmation(_id: ObjectId): Promise<boolean> {
      let result = await usersCollections.updateOne({_id}, {$set : {"emailConfirmation.isConfirmed": true}})
      return result.modifiedCount === 1
    },

    async findUserByEmail(email: string): Promise<userMongoModel | null>{
      try {let user = await usersCollections.findOne({"accountData.email": email})
      return user}
      catch (e) {return null}
    }
    
      
}
