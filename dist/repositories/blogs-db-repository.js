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
    findBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const skipPosts = (pageNumber - 1) * pageSize;
            const blogs = yield db_mongo_1.blogsCollections.find({ $text: { $search: searchNameTerm } }).sort(sortBy, sortDirection).skip(skipPosts).limit(pageSize).toArray();
            const totalCount = yield db_mongo_1.blogsCollections.count();
            const blogsOutput = blogs.map((b) => {
                return {
                    id: b._id.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: b.createdAt,
                    isMembership: false,
                };
            });
            return {
                pagesCount: blogsOutput.length,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: blogsOutput
            };
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_mongo_1.blogsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (blog) {
                return {
                    id: blog._id.toString(),
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: false,
                };
            }
            else {
                return null;
            }
        });
    },
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_mongo_1.blogsCollections.insertOne(Object.assign({}, newBlog));
            return Object.assign({ id: res.insertedId.toString() }, newBlog);
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield db_mongo_1.blogsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { name, description, websiteUrl } });
            return blog.matchedCount === 1;
        });
    },
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongo_1.blogsCollections.deleteOne({ _id: new mongodb_1.ObjectId(id) });
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
