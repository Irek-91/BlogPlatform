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
exports.runDb = exports.refreshTokenCollections = exports.commentsCollections = exports.usersCollections = exports.postsCollections = exports.blogsCollections = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error('URL doesn\'t found');
}
const client = new mongodb_1.MongoClient(mongoUri);
const db = client.db('BlogPlatform');
exports.blogsCollections = db.collection('blogs');
exports.postsCollections = db.collection('posts');
exports.usersCollections = db.collection('users');
exports.commentsCollections = db.collection('comments');
exports.refreshTokenCollections = db.collection('refreshTokens');
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log('Connected to db');
    }
    catch (e) {
        console.log('Don\'t connected');
        yield client.close();
    }
});
exports.runDb = runDb;
