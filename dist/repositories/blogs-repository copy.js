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
const db_1 = require("../db/db");
exports.blogsRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.blogs;
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = db_1.blogs.find(p => p.id === id);
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
            db_1.blogs.push(newBlog);
            return newBlog;
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = db_1.blogs.find(p => p.id === id);
            if (!blog) {
                return false;
            }
            else {
                blog.name = name;
                blog.description = description;
                blog.websiteUrl = websiteUrl;
                return true;
            }
        });
    },
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < db_1.blogs.length; i++) {
                if (db_1.blogs[i].id === id) {
                    db_1.blogs.splice(i, 1);
                    return true;
                }
            }
            return false;
        });
    },
    deleteBlogAll() {
        return __awaiter(this, void 0, void 0, function* () {
            db_1.blogs.length = 0;
            return true;
        });
    }
};
