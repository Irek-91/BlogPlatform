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
exports.blogsRepository = void 0;
const db_mongo_1 = require("../db/db-mongo");
const dbCollections = db_mongo_1.client.db('BlogPlatform').collection('blogs');
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return dbCollections.find({}).toArray();
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield dbCollections.findOne({ id: id });
            return blog;
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: String(+new Date()),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield dbCollections.insertOne(newBlog);
            return newBlog;
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogResult = yield dbCollections.updateOne({ id: id }, {
                $set: { name: name, description: description, websiteUrl: websiteUrl }
            });
            if (!blogResult) {
                return false;
            }
            else {
                return true;
            }
        });
    },
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield dbCollections.deleteOne({ id: id });
            return deletResult.deletedCount === 1;
        });
    },
    deleteBlogAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield dbCollections.deleteMany({});
            return true;
        });
    }
};
