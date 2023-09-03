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
exports.blogsService = void 0;
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const mongodb_1 = require("mongodb");
exports.blogsService = {
    findBlogs(paginationQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.findBlogs(paginationQuery);
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.getBlogId(id);
        });
    },
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                _id: new mongodb_1.ObjectId(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield blogs_db_repository_1.blogsRepository.createBlog(newBlog);
            return {
                id: newBlog._id.toString(),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
                isMembership: newBlog.isMembership
            };
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.updateBlog(name, description, websiteUrl, id);
        });
    },
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.deleteBlogId(id);
        });
    },
    deleteBlogAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.deleteBlogAll();
        });
    }
};
