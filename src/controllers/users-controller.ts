import { Request, Response, Router } from "express";
import {getPaginationFromQueryUser, QueryPaginationTypeUser} from "../midlewares/pagination-users";
import { UsersService } from "../domain/users-service";
import {paginatorUser} from "../types/types_paginator";
import {userViewModel} from "../types/user";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async findUsers(req: Request, res: Response) {
        const pagination: QueryPaginationTypeUser = getPaginationFromQueryUser(req.query)
        const findUsers: paginatorUser = await this.usersService.findUsers(pagination);
        res.send(findUsers)
    }
    async createUser(req: Request, res: Response) {
        const loginUser = req.body.login;
        const passwordUser = req.body.password;
        const emailUser = req.body.email;

        const newUser: userViewModel = await this.usersService.createUser(loginUser, passwordUser, emailUser);
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




