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
exports.filterCountIPAndURL = void 0;
const db_mongo_1 = require("../db/db-mongo");
const filterCountIPAndURL = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const IP = req.ip;
    const URL = req.baseUrl || req.originalUrl;
    const newAPI = {
        IP,
        URL,
        date: new Date()
    };
    const result = yield db_mongo_1.arrayIPAndURICollections.insertOne(Object.assign({}, newAPI));
    const count = yield db_mongo_1.arrayIPAndURICollections.find({ date: { $gt: new Date((new Date()).getTime() - 10000) } }).toArray();
    if (count.length > 5) {
        return res.sendStatus(429);
    }
    next();
});
exports.filterCountIPAndURL = filterCountIPAndURL;
