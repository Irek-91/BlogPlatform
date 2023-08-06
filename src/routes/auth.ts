import { body } from 'express-validator';
import { Request, Response, Router } from "express";
import { loginOrEmailValidation, passwordValidation } from "../midlewares/aurh-validation";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../midlewares/auth-middleware";
import { emailValidation, loginValidation, loginValidationLength } from "../midlewares/users_validation";
import { authService } from "../domain/auth-service";
import { emailAdapter } from "../application/email-adapter";
import { userInfo } from 'os';

export const authRouter = Router({});


authRouter.post('/login',
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail;
        const passwordUser = req.body.password;

        const newUser = await usersService.checkCredentials(loginOrEmail, passwordUser);
        if (newUser) {
            const accessToken = await jwtService.createJWT(newUser)
            res.status(200).send({ accessToken })
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
            const user = await usersService.findByUserId(req.user._id.toString())
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
    loginValidation,
    loginValidationLength,
    passwordValidation,
    emailValidation,
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
