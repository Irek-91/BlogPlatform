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
exports.userRepository = void 0;
const mongodb_1 = require("mongodb");
const db_mongoos_1 = require("../db/db-mongoos");
exports.userRepository = {
    findUsers(paginatorUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            // const filter = {
            //   $or: [{login: { $regex: paginatorUser.searchLoginTerm, $options: 'i' }
            //   ]
            // }
            if (paginatorUser.searchLoginTerm || paginatorUser.searchEmailTerm) {
                filter.$or = [];
                if (paginatorUser.searchLoginTerm) {
                    filter.$or.push({ 'accountData.login': { $regex: paginatorUser.searchLoginTerm, $options: 'i' } });
                }
                if (paginatorUser.searchEmailTerm) {
                    filter.$or.push({ 'accountData.email': { $regex: paginatorUser.searchEmailTerm, $options: 'i' } });
                }
            }
            const users = yield db_mongoos_1.UsersModelClass.find().
                where(filter).
                sort([[paginatorUser.sortBy, paginatorUser.sortDirection]]).
                skip(paginatorUser.skip).
                limit(paginatorUser.pageSize).
                lean();
            const totalCount = yield db_mongoos_1.UsersModelClass.countDocuments([filter]);
            const usersOutput = users.map((b) => {
                return {
                    id: b._id.toString(),
                    login: b.accountData.login,
                    email: b.accountData.email,
                    createdAt: b.accountData.createdAt,
                };
            });
            return {
                pagesCount: Math.ceil(totalCount / paginatorUser.pageSize),
                page: paginatorUser.pageNumber,
                pageSize: paginatorUser.pageSize,
                totalCount: totalCount,
                items: usersOutput
            };
        });
    },
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            //const res = await UsersModelClass.insertMany({...newUser, _id: new ObjectId()})
            const userInstance = new db_mongoos_1.UsersModelClass(newUser);
            userInstance._id = new mongodb_1.ObjectId();
            yield userInstance.save();
            const userViewVodel = {
                id: userInstance._id.toString(),
                login: userInstance.accountData.login,
                email: userInstance.accountData.email,
                createdAt: userInstance.accountData.createdAt
            };
            return userViewVodel;
        });
    },
    deleteUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_mongoos_1.UsersModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (user) {
                try {
                    yield db_mongoos_1.UsersModelClass.deleteOne({ _id: user._id });
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    },
    findByLoginOrEmailL(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_mongoos_1.UsersModelClass.findOne({ $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.login': loginOrEmail }] }).lean();
            if (user === null) {
                return false;
            }
            else {
                return user;
            }
        });
    },
    deleteUserAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongoos_1.UsersModelClass.deleteMany({});
            return true;
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield db_mongoos_1.UsersModelClass.findOne({ _id: userId });
                if (user === null) {
                    return false;
                }
                else {
                    return user;
                }
            }
            catch (e) {
                return false;
            }
        });
    },
    findUserByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield db_mongoos_1.UsersModelClass.findOne({ "emailConfirmation.confirmationCode": code }).lean();
                return user;
            }
            catch (e) {
                return null;
            }
        });
    },
    updateConfirmation(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_mongoos_1.UsersModelClass.updateOne({ _id }, { $set: { "emailConfirmation.isConfirmed": true } });
            return result.modifiedCount === 1;
        });
    },
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield db_mongoos_1.UsersModelClass.findOne({ "accountData.email": email }).lean();
                return user;
            }
            catch (e) {
                return null;
            }
        });
    },
    findUserByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield db_mongoos_1.UsersModelClass.findOne({ "accountData.login": login }).lean();
                return user;
            }
            catch (e) {
                return null;
            }
        });
    },
    updateCode(_id, code, expiritionDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_mongoos_1.UsersModelClass.updateOne({ _id }, { $set: { "emailConfirmation.confirmationCode": code, "emailConfirmation.expiritionDate": expiritionDate } });
            return result.modifiedCount === 2;
        });
    },
    updatePassword(_id, salt, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_mongoos_1.UsersModelClass.updateOne({ _id }, { $set: { "accountData.salt": salt, "accountData.hash": hash } });
            return result.modifiedCount === 2;
        });
    },
    updateRecoveryCode(_id, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_mongoos_1.UsersModelClass.updateOne({ _id }, { $set: { "emailConfirmation.recoveryCode": recoveryCode } });
            return result.modifiedCount === 1;
        });
    },
    findUserByRecoveryCode(recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield db_mongoos_1.UsersModelClass.findOne({ "emailConfirmation.recoveryCode": recoveryCode }).lean();
                return user;
            }
            catch (e) {
                return null;
            }
        });
    },
    /*async addNewAccessToken(userId: ObjectId, accessToken: string): Promise<boolean | null>{
      try {let result = await usersCollections.updateOne({_id: userId}, {$set: {'tokens.accessToken': accessToken}})
      return result.matchedCount === 1}
      catch (e) {return null}
    },
    async addNewrefreshToken(userId: ObjectId, refreshToken: string): Promise<boolean | null>{
      try {let result = await usersCollections.updateOne({_id: userId}, {$set: {'tokens.refreshToken': refreshToken}})
      return result.matchedCount === 1}
      catch (e) {return null}
    },

    async findAccesTokenByRefreshToken(refreshToken :string): Promise<userMongoModel | null>{
      try {let user = await usersCollections.findOne({"tokens.refreshToken": refreshToken})
          if (user) {return user}
          else {return null}
      }
      catch (e) {return null}
    }
    */
};
