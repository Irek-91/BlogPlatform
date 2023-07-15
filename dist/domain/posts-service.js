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
exports.postsService = void 0;
const blogs_db_repository_1 = require("./../repositories/blogs-db-repository");
const post_db_repository_1 = require("../repositories/post-db-repository");
exports.postsService = {
    findPost(pageNumber, pageSize, sortBy, sortDirections) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_db_repository_1.postRepository.findPost(pageNumber, pageSize, sortBy, sortDirections);
        });
    },
    findPostsBlogId(pageNumber, pageSize, sortBy, sortDirections, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_db_repository_1.postRepository.findPostsBlogId(pageNumber, pageSize, sortBy, sortDirections, blogId);
        });
    },
    getPostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return post_db_repository_1.postRepository.getPostId(id);
        });
    },
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_db_repository_1.postRepository.deletePostId(id);
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
            const creatPost = yield post_db_repository_1.postRepository.createdPostId(newPost);
            return creatPost;
        });
    },
    createdPostBlogId(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_db_repository_1.blogsRepository.getBlogId(blogId);
            if (blog != null) {
                const createdAt = new Date().toISOString();
                const newPost = {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
                    blogName: blog.name,
                    createdAt: createdAt
                };
                const creatPost = yield post_db_repository_1.postRepository.createdPostId(newPost);
                return creatPost;
            }
            else {
                return null;
            }
        });
    },
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_db_repository_1.postRepository.updatePostId(id, title, shortDescription, content, blogId);
        });
    },
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_db_repository_1.postRepository.deletePostAll();
        });
    }
};
