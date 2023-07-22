import bcrypt from 'bcrypt'
import { loginInputModel } from '../types/user'
import { userRepository } from '../repositories/users-db-repository'

/*export const authService = {  
    async checkCredentials(loginOrEmail:string, passwordUser:string) {
      const user = await userRepository.findByLoginOrEmailL(loginOrEmail)
      if (!user) {return false}
    
    },
    


  }*/