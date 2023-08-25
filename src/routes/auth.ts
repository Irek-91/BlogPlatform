import { emailValidationCustom, passwordValidation } from './../midlewares/users_validation';
import { Request, Response, Router } from "express";
import { loginOrEmailValidationAuth, passwordValidationAuth } from "../midlewares/aurh-validation";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../midlewares/auth-middleware";
import { emailValidation, loginValidation, loginValidationLength } from "../midlewares/users_validation";
import { authService } from "../domain/auth-service";
import { emailAdapter } from "../application/email-adapter";
import { tokensService } from '../domain/token-service';
import { chekRefreshToken } from '../midlewares/chek-refreshToket';
import { v4 as uuidv4 } from 'uuid';
import { filterCountIPAndURL } from '../midlewares/count-IPAndURIFilter';


export const authRouter = Router({});


authRouter.post('/login',
    filterCountIPAndURL,
    loginOrEmailValidationAuth,
    passwordValidationAuth,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail;
        const passwordUser = req.body.password;
        const divicId= uuidv4();
        const IP = req.ip
        const title = req.headers['user-agent'] || 'custom-ua'
        const newUser = await usersService.checkCredentials(loginOrEmail, passwordUser);
        if (newUser) {
            const accessToken = await jwtService.createdJWTAccessToken(newUser._id)
            const refreshToken = await tokensService.addDeviceIdRefreshToken(newUser._id, divicId, IP, title)
            if (accessToken !== null || refreshToken !== null) {
                res.cookie('refreshToken', refreshToken, {httpOnly: true,secure: true})
                res.status(200).send({ accessToken })
            }
        }
        else {
            res.sendStatus(401)
        }
    }
)


authRouter.post('/refresh-token',
    chekRefreshToken,
    async (req: Request, res: Response) => {
        const cookiesRefreshToken = req.cookies.refreshToken
        const IP = req.ip
        const title = req.headers['user-agent'] || 'custom-ua'

        const newAccessToken = await tokensService.updateAccessToken(cookiesRefreshToken)
        const newRefreshToken = await tokensService.updateRefreshTokens(cookiesRefreshToken, IP, title)

        if (newAccessToken !== null || newRefreshToken !== null) {
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true,secure: true})
            res.status(200).send({ accessToken: newAccessToken })
            }
        else {
        res.sendStatus(401)
        }
    }
)

authRouter.post('/logout',
    chekRefreshToken,
    async (req: Request, res: Response) => {
        const cookiesRefreshToken = req.cookies.refreshToken

        
        const result = await tokensService.deleteDeviceIdRefreshToken(cookiesRefreshToken)
                if (result === true) {
                    res.clearCookie('refreshToken')
                    res.sendStatus(204)
                }
                else {
                    res.sendStatus(401)
                }
        }
)



authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        if (req.user !== false) {
            const user = await usersService.findByUserId(req.user._id)
            if (user !== false) {
                res.status(200).send(user)
            }
            else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post('/registration',
filterCountIPAndURL,

    loginValidation,
    loginValidationLength,
    passwordValidation,
    emailValidation,
    emailValidationCustom,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const user = await authService.creatUser(req.body.login, req.body.password, req.body.email)
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
)


authRouter.post('/registration-confirmation',
    filterCountIPAndURL,

    async (req: Request, res: Response) => {
        const result = await authService.confirmationCode(req.body.code)
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
)


authRouter.post('/registration-email-resending',
    filterCountIPAndURL,
    emailValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
    const result = await authService.resendingEmail(req.body.email)
    if (result) {res.sendStatus(204)}
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
)


authRouter.post('/registration-email',
    async (req: Request, res: Response) => {
    const info = await emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.code)
    res.sendStatus(204)
})
