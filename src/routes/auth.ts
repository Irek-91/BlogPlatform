import { Request, Response, Router } from "express";
import { loginOrEmailValidation, passwordValidation } from "../midlewares/aurh-validation";
import { usersService } from "../domain/users-service";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";

export const authRouter = Router ({});

authRouter.post('/',
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware,

    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail;
        const passwordUser = req.body.password;
    
        const newUser = await usersService.checkCredentials(loginOrEmail,passwordUser);
        if (newUser === true)
            {
            res.sendStatus(204)
            }
        else {
            res.sendStatus(401)
            }
    }

)