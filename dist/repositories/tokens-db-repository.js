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
exports.tokensRepository = void 0;
const mongodb_1 = require("mongodb");
const db_mongo_1 = require("../db/db-mongo");
exports.tokensRepository = {
    findToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_mongo_1.refreshTokenCollections.findOne({ token: token });
                return result;
            }
            catch (e) {
                return null;
            }
        });
    },
    addRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_mongo_1.refreshTokenCollections.insertOne({ token, _id: new mongodb_1.ObjectId() });
            return res.acknowledged;
        });
    }
};
