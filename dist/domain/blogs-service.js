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
exports.BlogsService = void 0;
const blogs_db_repository_1 = require("./../repositories/blogs-db-repository");
const mongodb_1 = require("mongodb");
const db_mongoos_1 = require("../db/db-mongoos");
const types_blogs_1 = require("../types/types-blogs");
class BlogsService {
    constructor() {
        this.blogsRepository = new blogs_db_repository_1.BlogsRepository();
    }
    findBlogs(paginationQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.findBlogs(paginationQuery);
        });
    }
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.getBlogId(id);
        });
    }
    createBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = new types_blogs_1.BlogMongoDB(new mongodb_1.ObjectId(), name, description, websiteUrl, new Date().toISOString(), false);
            const newBlogInstance = new db_mongoos_1.BlogsModelClass(newBlog);
            yield this.blogsRepository.createBlog(newBlog);
            return {
                id: newBlog._id.toString(),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
                isMembership: newBlog.isMembership
            };
        });
    }
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.updateBlog(name, description, websiteUrl, id);
        });
    }
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.deleteBlogId(id);
        });
    }
    deleteBlogAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepository.deleteBlogAll();
        });
    }
}
exports.BlogsService = BlogsService;
