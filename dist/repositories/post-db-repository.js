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
exports.postRepository = void 0;
const db_mongo_1 = require("../db/db-mongo");
const mongodb_1 = require("mongodb");
exports.postRepository = {
    findPost(paginationQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_mongo_1.postsCollections.find({}).
                sort(paginationQuery.sortBy, paginationQuery.sortDirection).
                skip(paginationQuery.skip).
                limit(paginationQuery.pageSize).
                toArray();
            const totalCount = yield db_mongo_1.postsCollections.countDocuments();
            const pagesCount = Math.ceil(totalCount / paginationQuery.pageSize);
            const postsOutput = posts.map((b) => {
                return {
                    id: b._id.toString(),
                    title: b.title,
                    shortDescription: b.shortDescription,
                    content: b.content,
                    blogId: b.blogId,
                    blogName: b.blogName,
                    createdAt: b.createdAt,
                };
            });
            return { pagesCount: pagesCount,
                page: paginationQuery.pageNumber,
                pageSize: paginationQuery.pageSize,
                totalCount: totalCount,
                items: postsOutput
            };
        });
    },
    findPostsBlogId(paginationQuery, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { blogId: blogId };
                const posts = yield db_mongo_1.postsCollections
                    .find(filter)
                    .sort(paginationQuery.sortBy, paginationQuery.sortDirection)
                    .skip(paginationQuery.skip)
                    .limit(paginationQuery.pageSize)
                    .toArray();
                const totalCount = yield db_mongo_1.postsCollections.countDocuments(filter);
                const pagesCount = Math.ceil(totalCount / (paginationQuery.pageSize));
                const postsOutput = posts.map((b) => {
                    return {
                        id: b._id.toString(),
                        title: b.title,
                        shortDescription: b.shortDescription,
                        content: b.content,
                        blogId: b.blogId,
                        blogName: b.blogName,
                        createdAt: b.createdAt,
                    };
                });
                return { pagesCount: pagesCount,
                    page: paginationQuery.pageNumber,
                    pageSize: paginationQuery.pageSize,
                    totalCount: totalCount,
                    items: postsOutput
                };
            }
            catch (e) {
                return false;
            }
        });
    },
    getPostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield db_mongo_1.postsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!post) {
                    return false;
                }
                else {
                    return {
                        id: post._id.toString(),
                        title: post.title,
                        shortDescription: post.shortDescription,
                        content: post.content,
                        blogId: post.blogId,
                        blogName: post.blogName,
                        createdAt: post.createdAt,
                    };
                }
            }
            catch (e) {
                return false;
            }
        });
    },
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield db_mongo_1.postsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (post) {
                    try {
                        yield db_mongo_1.postsCollections.deleteOne({ _id: post._id });
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        });
    },
    createdPostId(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield db_mongo_1.postsCollections.insertOne(Object.assign(Object.assign({}, newPost), { _id: new mongodb_1.ObjectId() }));
            return Object.assign({ id: res.insertedId.toString() }, newPost);
        });
    },
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_mongo_1.postsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { title, shortDescription, content, blogId } });
                if (post.matchedCount) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        });
    },
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongo_1.postsCollections.find({}).toArray();
            if (deletResult) {
                try {
                    yield db_mongo_1.postsCollections.deleteMany({});
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
