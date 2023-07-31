import { Request, Response, Router } from "express";
import { loginOrEmailValidation, passwordValidation } from "../midlewares/aurh-validation";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { jwtService } from "../application/jwt-service";
import { authMiddleware } from "../midlewares/auth-middleware";

export const authRouter = Router ({});


authRouter.post('/login',
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail;
        const passwordUser = req.body.password;
    
        const newUser = await usersService.checkCredentials(loginOrEmail,passwordUser);
        if (newUser)
            {
                const accessToken = await jwtService.createJWT(newUser)
                res.status(200).send({accessToken})
            }
        else {
            res.sendStatus(401)
            }
    }
)


authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        if (req.user !==false) {
            const user = await usersService.findByUserId(req.user._id.toString())
                if (user !== false) 
                    {
                        res.status(200).send(user)
                    }
                else {
                    res.sendStatus(401)
                    }
        } else {
            res.sendStatus(401)}
    })

    