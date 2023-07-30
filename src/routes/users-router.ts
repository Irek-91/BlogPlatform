import { Request, Response, Router } from "express";
import { authMidleware } from "../midlewares/basicAuth";
import { getPaginationFromQueryUser } from "../midlewares/pagination-users";
import { usersService } from "../domain/users-service";
import { emailValidation, loginValidation, loginValidationLength, passwordValidation } from "../midlewares/users_validation";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";

export const usersRouter = Router({})


usersRouter.get('/', 
    authMidleware,
    async (req: Request, res: Response) => {
        const pagination = getPaginationFromQueryUser(req.query)
        
        const founUsers = await usersService.findUsers(pagination);
        res.send(founUsers)
    })

usersRouter.post('/',
    authMidleware,
    loginValidation,
    loginValidationLength,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const loginUser = req.body.login;
        const passwordUser = req.body.password;
        const emailUser = req.body.email;
    
        const newUser = await usersService.createUser(loginUser,passwordUser,emailUser);
      
        res.status(201).send(newUser)
    }

)

usersRouter.delete('/:id',
    authMidleware,
    async (req: Request, res: Response) => {
        let userId = await usersService.deleteUserId(req.params.id)
        if (userId) {  
            res.sendStatus(204)
          } else {
            res.sendStatus(404)
          }
    }
)


    
    
