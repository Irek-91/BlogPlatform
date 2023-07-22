import { QueryPaginationTypeUser } from "../midlewares/pagination-users"
import { userRepository } from "../repositories/users-db-repository"
import { userCreatModel, userCreatModelPassword } from "../types/user"
import bcrypt from 'bcrypt'



export const usersService = {  
    async findUsers(paginationQuery : QueryPaginationTypeUser) {
      return await userRepository.findUsers(paginationQuery)
    },

    async createUser(loginUser: string, passwordUser: string, emailUser:string) {
        const createdAt = new Date().toISOString();
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(passwordUser, passwordSalt)
        
        const newUser: userCreatModelPassword = {
            login: loginUser,
            email: emailUser,
            salt: passwordSalt,
            hash: passwordHash,
            createdAt: createdAt
        }
        return await userRepository.createUser(newUser)
    },

    async deleteUserId (id: string) {
        return await userRepository.deleteUserId(id)
    },
    
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
      },
    
    async checkCredentials(loginOrEmail:string, passwordUser:string): Promise<boolean> {
        const user = await userRepository.findByLoginOrEmailL(loginOrEmail)
        if (!user) 
          {
          return false
          }
        else {
          const passwordHash = await this._generateHash(passwordUser, user.salt)
            if (user.hash !== passwordHash) 
            {
              return false
            }
            else 
            {
              return true
            }
          }
      }   
    

}