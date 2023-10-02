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
exports.UsersController = void 0;
const pagination_users_1 = require("../midlewares/pagination-users");
class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
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
exports.UsersController = UsersController;
