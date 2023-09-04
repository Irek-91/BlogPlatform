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
exports.usersService = void 0;
const users_db_repository_1 = require("../repositories/users-db-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
exports.usersService = {
    findUsers(paginationQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.userRepository.findUsers(paginationQuery);
        });
    },
    createUser(loginUser, passwordUser, emailUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(passwordUser, passwordSalt);
            const confirmationCode = (0, uuid_1.v4)();
            const recoveryCode = (0, uuid_1.v4)();
            const expiritionDate = (0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 3
            });
            const newUser = {
                accountData: {
                    login: loginUser,
                    email: emailUser,
                    salt: passwordSalt,
                    hash: passwordHash,
                    createdAt: createdAt
                },
                emailConfirmation: {
                    confirmationCode: confirmationCode,
                    expiritionDate: expiritionDate.toISOString(),
                    isConfirmed: false,
                    recoveryCode: recoveryCode
                }
            };
            return yield users_db_repository_1.userRepository.createUser(newUser);
        });
    },
    deleteUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.userRepository.deleteUserId(id);
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
    checkCredentials(loginOrEmail, passwordUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.userRepository.findByLoginOrEmailL(loginOrEmail);
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
    },
    deleteUserAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.userRepository.deleteUserAll();
        });
    },
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            /*const userId = await jwtService.getUserIdByToken()
            if (userId) {*/
            const result = yield users_db_repository_1.userRepository.findUserById(userId);
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
    },
    findUserByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_db_repository_1.userRepository.findUserByCode(code);
            return user;
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_db_repository_1.userRepository.findUserByEmail(email);
            return user;
        });
    },
};
