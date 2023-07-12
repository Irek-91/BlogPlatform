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
const mongodb_1 = require("mongodb");
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_mongo_1.blogsCollections.find({}).toArray();
            const blogsOutput = blogs.map((b) => {
                return {
                    id: b._id,
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                };
            });
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_mongo_1.blogsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return false;
            }
            else {
                return {
                    id: blog._id,
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                };
            }
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            const res = yield db_mongo_1.blogsCollections.insertOne(Object.assign({}, newBlog));
            return Object.assign({ id: res.insertedId.toString() }, newBlog);
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_mongo_1.blogsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { name, description, websiteUrl } });
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
