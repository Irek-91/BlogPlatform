import { Request, Response, Router } from "express";
import { jwtService } from "../application/jwt-service";
import { AuthService } from "../domain/auth-service";
import { TokensService } from '../domain/token-service';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../domain/users-service';

export class AuthController {
    constructor(protected usersService: UsersService, protected tokensService: TokensService, protected authService: AuthService) {}
    async loginUserToTheSystem(req: Request, res: Response) {
        const loginOrEmail = req.body.loginOrEmail;
        const passwordUser = req.body.password;
        const divicId = uuidv4();
        const IP = req.ip
        const title = req.headers['user-agent'] || 'custom-ua'
        const newUser = await this.usersService.checkCredentials(loginOrEmail, passwordUser);
        if (newUser === false) return res.sendStatus(401)

        const accessToken = await jwtService.createdJWTAccessToken(newUser._id)
        const refreshToken = await this.tokensService.addDeviceIdRefreshToken(newUser._id, divicId, IP, title)
        if (accessToken !== null || refreshToken !== null) {
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
            res.status(200).send({ accessToken })
        }
        else {
            res.sendStatus(401)
        }
    }
    async generateNewPairOfAccessAndRefreshTokens(req: Request, res: Response) {
        const cookiesRefreshToken = req.cookies.refreshToken
        const IP = req.ip
        const title = req.headers['user-agent'] || 'custom-ua'

        const newAccessToken = await this.tokensService.updateAccessToken(cookiesRefreshToken)
        const newRefreshToken = await this.tokensService.updateDevicesModelClass(cookiesRefreshToken, IP, title)

        if (newAccessToken !== null || newRefreshToken !== null) {
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true })
            res.status(200).send({ accessToken: newAccessToken })
        }
        else {
            res.sendStatus(401)
        }
    }

    async sendCorrectRefreshTokenThatWillBeRevoked(req: Request, res: Response) {
        const cookiesRefreshToken = req.cookies.refreshToken
        const result = await this.tokensService.deleteDeviceIdRefreshToken(cookiesRefreshToken)
        if (result === true) {
            res.clearCookie('refreshToken')
            res.sendStatus(204)
        }
        else {
            res.sendStatus(401)
        }
    }
    async getInformationAboutCurrentUser(req: Request, res: Response) {
        if (req.user !== false) {
            const user = await this.usersService.findByUserId(req.user._id)
            if (user !== false) {
                res.status(200).send(user)
            }
            else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }
    }
    async codeWillBeSendToPassedEmailAddress(req: Request, res: Response) {
        const user = await this.authService.creatUser(req.body.login, req.body.password, req.body.email)
        if (user) {
            res.sendStatus(204)
        }
        else {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "if email is already confirmed",
                        field: "email"
                    }
                ]
            })
        }
    }

    async confirmRegistrationCode(req: Request, res: Response) {
        const result = await this.authService.confirmationCode(req.body.code)
        if (result) {
            res.sendStatus(204)
        }
        else {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "Error in code",
                        field: "code"
                    }
                ]
            })
        }
    }

    async resendConfirmationRegistrationEmail(req: Request, res: Response) {
        const result = await this.authService.resendingEmail(req.body.email)
        if (result) { res.sendStatus(204) }
        else {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "if email is already confirmed",
                        field: "email"
                    }
                ]
            })
        }
    }

    async passwordRecoveryViaEmail(req: Request, res: Response) {
        const result = await this.authService.passwordRecovery(req.body.email)
        res.sendStatus(204)
    }

    async confirmNewPasswordRecovery(req: Request, res: Response) {
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode
        const result = await this.authService.newPassword(newPassword, recoveryCode)
        if (result) {
            res.sendStatus(204)
        }
        else {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "RecoveryCode is incorrect or expired",
                        field: "recoveryCode"
                    }
                ]
            })
        }

    }

}
