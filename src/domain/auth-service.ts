import { User, userMongoModel, userViewModel } from '../types/user';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add'
import { userRepository } from '../repositories/users-db-repository';
import { usersService } from './users-service';
import { emailAdapter } from '../application/email-adapter';



export const authService = {
    async creatUser (login: string, password: string, email: string): Promise<userViewModel | null> {
        const emailChack = await userRepository.findByEmailL(email)
        if (emailChack === false) {return null} //пользователь с данным адресом электронной почты или паролем уже существует
        const createdAt = new Date().toISOString();
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        
        const newUser: User = {
            accountData: {
                login: login,
                email: email,
                salt: passwordSalt,
                hash: passwordHash,
                createdAt: createdAt
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expiritionDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        const creatresult = await userRepository.createUser(newUser)
        try {
            await emailAdapter.sendEmail(newUser.accountData.email, 'code', newUser.emailConfirmation.confirmationCode)
        } catch(e) {
            //const idNewUser = await userRepository.findByLoginOrEmailL(newUser.accountData.email)
            //if (idNewUser) {
            //const deleteNewUser = await userRepository.deleteUserId(idNewUser._id.toString())}
            return null
        }
        return creatresult
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
    },

    async confirmationCode (code: string) : Promise<boolean> {
        let user = await usersService.findUserByCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed === true) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expiritionDate < new Date ()) return false
        
        let result = await userRepository.updateConfirmation(user._id)
        return result
    },

    async resendingEmail(email: string) : Promise<null | boolean> {
        let user = await usersService.findUserByEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed === true) return false
        try {
            await emailAdapter.sendEmail(user.accountData.email, 'code', user.emailConfirmation.confirmationCode)
            return true
        } catch(e) {
            return null
        }
    }

}