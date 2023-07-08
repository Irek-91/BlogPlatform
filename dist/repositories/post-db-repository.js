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
//import { posts } from "../db/db";
const db_mongo_1 = require("../db/db-mongo");
exports.postRepository = {
    findPost() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_mongo_1.postsCollections.find({}).toArray();
        });
    },
    getPostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = db_mongo_1.postsCollections.findOne({ id: id });
            return post;
        });
    },
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let postId = yield db_mongo_1.postsCollections.deleteOne({ id: id });
            return postId.deletedCount === 1;
        });
    },
    createdPostId(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_db_repository_1.blogsRepository.getBlogId(blogId);
            const createdAt = new Date().toISOString();
            const newPost = {
                id: String(+(new Date())),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: createdAt
            };
            yield db_mongo_1.postsCollections.insertOne(newPost);
            return newPost;
        });
    },
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_mongo_1.postsCollections.updateOne({ id: id }, { $set: { title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId }
            });
            if (post) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongo_1.postsCollections.deleteMany({});
            return true;
        });
    }
};
