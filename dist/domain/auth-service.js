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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const users_db_repository_1 = require("../repositories/users-db-repository");
const users_service_1 = require("./users-service");
const email_adapter_1 = require("../application/email-adapter");
exports.authService = {
    creatUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                accountData: {
                    login: login,
                    email: email,
                    salt: passwordSalt,
                    hash: passwordHash,
                    createdAt: createdAt
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expiritionDate: (0, add_1.default)(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: false
                }
            };
            const creatresult = yield users_db_repository_1.userRepository.createUser(newUser);
            try {
                yield email_adapter_1.emailAdapter.sendEmail(newUser.accountData.email, 'code', newUser.emailConfirmation.confirmationCode);
            }
            catch (e) {
                //const idNewUser = await userRepository.findByLoginOrEmailL(newUser.accountData.email)
                //if (idNewUser) {
                //const deleteNewUser = await userRepository.deleteUserId(idNewUser._id.toString())}
                return null;
            }
            return creatresult;
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, salt);
            return hash;
        });
    },
    confirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_service_1.usersService.findUserByCode(code);
            if (!user)
                return false;
            if (user.emailConfirmation.isConfirmed === true)
                return false;
            if (user.emailConfirmation.confirmationCode !== code)
                return false;
            if (user.emailConfirmation.expiritionDate < new Date())
                return false;
            let result = yield users_db_repository_1.userRepository.updateConfirmation(user._id);
            return result;
        });
    },
    resendingEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_service_1.usersService.findUserByEmail(email);
            if (user === null)
                return false;
            if (user.emailConfirmation.isConfirmed === true)
                return false;
            const confirmationCode = (0, uuid_1.v4)();
            const expiritionDate = (0, add_1.default)(new Date(), {
                hours: 1,
                minutes: 2
            });
            yield users_db_repository_1.userRepository.updateCode(user._id, confirmationCode, expiritionDate);
            yield email_adapter_1.emailAdapter.sendEmail(user.accountData.email, 'code', confirmationCode);
            return true;
        });
    },
    passwordRecovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield users_service_1.usersService.findUserByEmail(email);
            if (user === null)
                return true;
            const confirmationCode = (0, uuid_1.v4)();
            const expiritionDate = (0, add_1.default)(new Date(), {
                hours: 1,
                minutes: 2
            });
            yield users_db_repository_1.userRepository.updateCode(user._id, confirmationCode, expiritionDate);
            yield email_adapter_1.emailAdapter.passwordRecovery(user.accountData.email, 'code', confirmationCode);
            return true;
        });
    },
    newPassword(newPassword, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const expiritionDate = (0, add_1.default)(new Date(), {
                hours: 1,
                minutes: 2
            });
            let result = yield users_db_repository_1.userRepository.findUserByCode(recoveryCode);
            if (result === null)
                return false;
            if (result.emailConfirmation.expiritionDate < date)
                return false;
            const resultUpdateCode = yield users_db_repository_1.userRepository.updateCode(result._id, recoveryCode, expiritionDate);
            if (resultUpdateCode === false)
                return false;
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(newPassword, passwordSalt);
            const resultUpdatePassword = yield users_db_repository_1.userRepository.updatePassword(result._id, passwordSalt, passwordHash);
            if (resultUpdatePassword === false)
                return false;
            return true;
        });
    }
};
