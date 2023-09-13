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
const mongodb_1 = require("mongodb");
const db_mongoos_1 = require("../db/db-mongoos");
exports.postRepository = {
    findPost(paginationQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_mongoos_1.PostsModelClass.find({}).
                sort([[paginationQuery.sortBy, paginationQuery.sortDirection]]).
                skip(paginationQuery.skip).
                limit(paginationQuery.pageSize);
            const totalCount = yield db_mongoos_1.PostsModelClass.countDocuments();
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
                const posts = yield db_mongoos_1.PostsModelClass
                    .find(filter)
                    .sort([[paginationQuery.sortBy, paginationQuery.sortDirection]])
                    .skip(paginationQuery.skip)
                    .limit(paginationQuery.pageSize)
                    .lean();
                const totalCount = yield db_mongoos_1.PostsModelClass.countDocuments(filter);
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
                let post = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
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
            const postInstance = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!postInstance) {
                return false;
            }
            yield postInstance.deleteOne();
            return true;
        });
    },
    createdPostId(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const postInstance = new db_mongoos_1.PostsModelClass(newPost);
            yield postInstance.save();
            return {
                id: postInstance._id.toString(),
                title: postInstance.title,
                shortDescription: postInstance.shortDescription,
                content: postInstance.content,
                blogId: postInstance.blogId,
                blogName: postInstance.blogName,
                createdAt: postInstance.createdAt
            };
        });
    },
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            //const postInstance = await PostsModelClass.updateOne({_id: new ObjectId(id)}, {$set: {title , shortDescription, content, blogId}})    
            const postInstance = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!postInstance)
                return false;
            postInstance.title = title;
            postInstance.shortDescription = shortDescription;
            postInstance.content = content;
            postInstance.save();
            return true;
        });
    },
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const postInstance = yield db_mongoos_1.PostsModelClass.deleteMany({});
            if (!postInstance) {
                return false;
            }
            return true;
        });
    }
};
