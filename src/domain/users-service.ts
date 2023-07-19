import { QueryPaginationType } from "../midlewares/pagination"
import { QueryPaginationTypeUser } from "../midlewares/pagination-users"
import { userRepository } from "../repositories/users-db-repository"
import { userCreatModel, userInputModel, userMongoModel, userViewModel } from "../types/user"



export const usersService = {  
    async findUsers(paginationQuery : QueryPaginationTypeUser) {
      return await userRepository.findUsers(paginationQuery)
    },

    async createUser(loginUser: string,passwordUser: string,emailUser:string) {
        const createdAt = new Date().toISOString();

        const newUser: userCreatModel = {
            login: loginUser,
            email: emailUser,
            createdAt: createdAt
        }
        return await userRepository.createUser(newUser)
    },

    async deleteUserId (id: string) {
        return await userRepository.deleteUserId(id)
    }

}