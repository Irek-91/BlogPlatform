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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const user_1 = require("../types/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    findUsers(paginationQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findUsers(paginationQuery);
        });
    }
    createUser(loginUser, passwordUser, emailUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(passwordUser, passwordSalt);
            const confirmationCode = (0, uuid_1.v4)();
            const recoveryCode = (0, uuid_1.v4)();
            const isConfirmed = false;
            const expiritionDate = ((0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 3
            })).toISOString();
            const newUser = new user_1.UserMongoModel(new mongodb_1.ObjectId(), {
                login: loginUser,
                email: emailUser,
                salt: passwordSalt,
                hash: passwordHash,
                createdAt
            }, {
                confirmationCode,
                expiritionDate,
                isConfirmed,
                recoveryCode
            });
            return yield this.userRepository.createUser(newUser);
        });
    }
    deleteUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.deleteUserId(id);
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    }
    checkCredentials(loginOrEmail, passwordUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByLoginOrEmailL(loginOrEmail);
            if (!user) {
                return false;
            }
            const passwordHash = yield this._generateHash(passwordUser, user.accountData.salt);
            if (user.accountData.hash !== passwordHash) {
                return false;
            }
            else {
                return user;
            }
        });
    }
    deleteUserAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.deleteUserAll();
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepository.findUserById(userId);
            if (result) {
                const resultUserViewModel = {
                    email: result.accountData.email,
                    login: result.accountData.login,
                    userId: result._id
                };
                return resultUserViewModel;
            }
            return false;
        });
    }
    findUserByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findUserByCode(code);
            return user;
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findUserByEmail(email);
            return user;
        });
    }
}
exports.UsersService = UsersService;
//export const usersService = new UsersService()
