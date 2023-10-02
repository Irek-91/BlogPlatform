import { Request, Response, Router } from "express";
import { authMidleware } from "../midlewares/basicAuth";
import { getPaginationFromQueryUser } from "../midlewares/pagination-users";
import { UsersService } from "../domain/users-service";
import { emailValidation, loginValidation, loginValidationLength, passwordValidation } from "../midlewares/users_validation";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { usersController } from "../composition-root";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async findUsers(req: Request, res: Response) {
        const pagination = getPaginationFromQueryUser(req.query)

        const founUsers = await this.usersService.findUsers(pagination);
        res.send(founUsers)
    }
    async createUser(req: Request, res: Response) {
        const loginUser = req.body.login;
        const passwordUser = req.body.password;
        const emailUser = req.body.email;

        const newUser = await this.usersService.createUser(loginUser, passwordUser, emailUser);

        res.status(201).send(newUser)
    }

    async deleteUserId(req: Request, res: Response) {
        let userId = await this.usersService.deleteUserId(req.params.id)
        if (userId) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

}




