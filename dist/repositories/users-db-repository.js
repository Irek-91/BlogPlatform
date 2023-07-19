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
            const users = yield db_mongo_1.usersCollections.
                find({ login: { $regex: paginatorUser.searchEmailTerm, $options: 'i' } }).
                sort(paginatorUser.sortBy, paginatorUser.sortDirection).
                skip(paginatorUser.skip).
                limit(paginatorUser.pageSize).
                toArray();
            const totalCount = yield db_mongo_1.usersCollections.countDocuments({ name: { $regex: paginatorUser.searchEmailTerm, $options: 'i' } });
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
            const res = yield db_mongo_1.usersCollections.insertOne(Object.assign({}, newUser));
            return Object.assign({ id: res.insertedId.toString() }, newUser);
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
    }
};
