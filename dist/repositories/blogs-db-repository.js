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
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_mongo_1.blogsCollections.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_mongo_1.blogsCollections.findOne({ id: id }, { projection: { _id: 0 } });
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
            yield db_mongo_1.blogsCollections.insertOne(Object.assign({}, newBlog));
            return newBlog;
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_mongo_1.blogsCollections.updateOne({ id: id }, { $set: { name, description, websiteUrl } });
            console.log(blog);
            if (blog.matchedCount) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongo_1.blogsCollections.deleteOne({ id: id });
            return deletResult.deletedCount === 1;
        });
    },
    deleteBlogAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongo_1.blogsCollections.deleteMany({});
            return true;
        });
    }
};
