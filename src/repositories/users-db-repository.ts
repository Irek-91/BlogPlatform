import { usersCollections } from '../db/db-mongo';
import { QueryPaginationTypeUser } from '../midlewares/pagination-users';
import { userCreatModel, userInputModel, userViewModel } from '../types/user';
import { paginatorUser } from './../types/types_paginator';
import { ObjectId } from "mongodb";




export const userRepository = {
    async findUsers(paginatorUser: QueryPaginationTypeUser) {
        const users = await usersCollections.
                                            find({ login: { $regex: paginatorUser.searchEmailTerm, $options: 'i' }}).
                                            sort(paginatorUser.sortBy,paginatorUser.sortDirection).
                                            skip(paginatorUser.skip).
                                            limit(paginatorUser.pageSize).
                                            toArray();
        const totalCount = await usersCollections.countDocuments({ name: { $regex: paginatorUser.searchEmailTerm, $options: 'i' }})
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
              return {
              id: res.insertedId.toString(),
              ...newUser,
            }
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
    }
}
