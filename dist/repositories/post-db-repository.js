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
const blogs_db_repository_1 = require("./blogs-db-repository");
const db_mongo_1 = require("../db/db-mongo");
const mongodb_1 = require("mongodb");
exports.postRepository = {
    findPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_mongo_1.postsCollections.find({}).toArray();
            const postOuput = posts.map((b) => {
                return {
                    id: b._id,
                    title: b.title,
                    shortDescription: b.shortDescription,
                    content: b.content,
                    blogId: b.blogId,
                    blogName: b.blogName,
                    createdAt: b.createdAt,
                };
            });
        });
    },
    getPostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    },
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let postId = yield db_mongo_1.postsCollections.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (postId) {
                try {
                    yield db_mongo_1.postsCollections.deleteOne(postId);
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
    },
    createdPostId(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_db_repository_1.blogsRepository.getBlogId(blogId);
            const createdAt = new Date().toISOString();
            const newPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: createdAt
            };
            const res = yield db_mongo_1.postsCollections.insertOne(Object.assign({}, newPost));
            return Object.assign({ id: res.insertedId.toString() }, newPost);
        });
    },
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_mongo_1.postsCollections.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { title, shortDescription, content, blogId } });
            if (post.matchedCount) {
                return true;
            }
            else {
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
