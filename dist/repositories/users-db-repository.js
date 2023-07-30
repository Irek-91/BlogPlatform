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
const db_mongo_1 = require("../db/db-mongo");
const mongodb_1 = require("mongodb");
exports.userRepository = {
    findUsers(paginatorUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (paginatorUser.searchLoginTerm || paginatorUser.searchEmailTerm) {
                filter.$or = [];
                if (paginatorUser.searchLoginTerm) {
                    filter.$or.push({ login: { $regex: paginatorUser.searchLoginTerm, $options: 'i' } });
                }
                if (paginatorUser.searchEmailTerm) {
                    filter.$or.push({ email: { $regex: paginatorUser.searchEmailTerm, $options: 'i' } });
                }
            }
            const users = yield db_mongo_1.usersCollections.find(filter).
                sort(paginatorUser.sortBy, paginatorUser.sortDirection).
                skip(paginatorUser.skip).
                limit(paginatorUser.pageSize).
                toArray();
            const totalCount = yield db_mongo_1.usersCollections.countDocuments(filter);
            const usersOutput = users.map((b) => {
                return {
                    id: b._id.toString(),
                    login: b.login,
                    email: b.email,
                    createdAt: b.createdAt,
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
            const res = yield db_mongo_1.usersCollections.insertOne(Object.assign(Object.assign({}, newUser), { _id: new mongodb_1.ObjectId() }));
            const userViewVodel = {
                id: res.insertedId.toString(),
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
            return userViewVodel;
        });
    },
    deleteUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_mongo_1.usersCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (user) {
                try {
                    yield db_mongo_1.usersCollections.deleteOne({ _id: user._id });
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
            const user = yield db_mongo_1.usersCollections.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
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
            const deletResult = yield db_mongo_1.usersCollections.deleteMany({});
            return true;
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield db_mongo_1.usersCollections.findOne({ _id: new mongodb_1.ObjectId(userId) });
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
};
