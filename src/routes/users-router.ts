import { Request, Response, Router } from "express";
import { authMidleware } from "../midlewares/basicAuth";
import { emailValidation, loginValidation, loginValidationLength, passwordValidation } from "../midlewares/users_validation";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { usersController } from "../composition-root";

export const usersRouter = Router({})

usersRouter.get('/', authMidleware, usersController.findUsers.bind(usersController))

usersRouter.post('/', authMidleware, loginValidation, loginValidationLength, passwordValidation, emailValidation,
    inputValidationMiddleware, usersController.createUser.bind(usersController)
)

usersRouter.delete('/:id',
    authMidleware, usersController.deleteUserId.bind(usersController))




