import { usersCollections } from '../db/db-mongo';
import { QueryPaginationTypeUser } from '../midlewares/pagination-users';
import { userCreatModel, userCreatModelPassword, userInputModel, userMongoModel, userPasswordSaltMongo, userViewModel } from '../types/user';
import { ObjectId } from "mongodb";



export const userRepository = {
    async findUsers(paginatorUser: QueryPaginationTypeUser) {
      const filter: any = {};

      if (paginatorUser.searchLoginTerm || paginatorUser.searchEmailTerm) {
        filter.$or = []
          if (paginatorUser.searchLoginTerm) {
            filter.$or.push( {login: { $regex: paginatorUser.searchLoginTerm, $options: 'i' }})
          }
          if (paginatorUser.searchEmailTerm) {
            filter.$or.push( {email: { $regex: paginatorUser.searchEmailTerm, $options: 'i' }})
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
              login: b.login,
              email: b.email,
              createdAt: b.createdAt,
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
        
    async createUser(newUser: userCreatModel): Promise<userViewModel> {
            const res = await usersCollections.insertOne({...newUser})
            const userViewVodel = {
              id: res.insertedId.toString(),
              login: newUser.login,
              email: newUser.email,
              createdAt: newUser.createdAt
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

    async findByLoginOrEmailL(loginOrEmail: string) {
      const user  = await usersCollections.findOne({$or: [{email: loginOrEmail }, {login: loginOrEmail}]})
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
    }
}
