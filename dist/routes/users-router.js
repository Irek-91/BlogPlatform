"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const basicAuth_1 = require("../midlewares/basicAuth");
const pagination_users_1 = require("../midlewares/pagination-users");
const users_service_1 = require("../domain/users-service");
const users_validation_1 = require("../midlewares/users_validation");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
exports.usersRouter = (0, express_1.Router)({});
class UsersController {
    constructor() {
        this.usersService = new users_service_1.UsersService();
    }
    findUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = (0, pagination_users_1.getPaginationFromQueryUser)(req.query);
            const founUsers = yield this.usersService.findUsers(pagination);
            res.send(founUsers);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginUser = req.body.login;
            const passwordUser = req.body.password;
            const emailUser = req.body.email;
            const newUser = yield this.usersService.createUser(loginUser, passwordUser, emailUser);
            res.status(201).send(newUser);
        });
    }
    deleteUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = yield this.usersService.deleteUserId(req.params.id);
            if (userId) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
const usersControllerInstace = new UsersController();
exports.usersRouter.get('/', basicAuth_1.authMidleware, usersControllerInstace.findUsers.bind(usersControllerInstace));
exports.usersRouter.post('/', basicAuth_1.authMidleware, users_validation_1.loginValidation, users_validation_1.loginValidationLength, users_validation_1.passwordValidation, users_validation_1.emailValidation, input_validation_middleware_1.inputValidationMiddleware, usersControllerInstace.createUser.bind(usersControllerInstace));
exports.usersRouter.delete('/:id', basicAuth_1.authMidleware, usersControllerInstace.deleteUserId.bind(usersControllerInstace));
