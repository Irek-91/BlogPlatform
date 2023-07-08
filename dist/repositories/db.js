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
exports.posts = exports.blogs = exports.runDb = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URL || "mongodb://;";
exports.client = new mongodb_1.MongoClient(mongoUri);
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield exports.client.db().command({ ping: 1 });
            console.log("Connected successfully to mongo server");
        }
        catch (_a) {
            console.log("Can't connect to db");
            yield exports.client.close();
        }
    });
}
exports.runDb = runDb;
exports.blogs = [
    {
        id: "1",
        name: "name1",
        description: "description",
        websiteUrl: "websiteUrl",
        createdAt: "2023-07-08T06:35:04.771Z",
        isMembership: true
    },
    {
        id: "2",
        name: "name2",
        description: "description",
        websiteUrl: "websiteUrl",
        createdAt: "2023-07-08T06:35:04.771Z",
        isMembership: true
    }
];
exports.posts = [
    {
        id: '1',
        title: "post1",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "name1",
        createdAt: "2023-07-08T06:34:05.135Z",
    },
    {
        id: '2',
        title: "post1",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "name2",
        createdAt: "2023-07-08T06:34:05.135Z",
    }
];
