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
exports.blogsRouter = void 0;
const posts_service_1 = require("./../domain/posts-service");
const blogs_service_1 = require("./../domain/blogs-service");
const express_1 = require("express");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const blogs_validation_1 = require("../midlewares/blogs-validation");
const basicAuth_1 = require("../midlewares/basicAuth");
const post_validation_1 = require("../midlewares/post-validation");
const pagination_1 = require("../midlewares/pagination");
exports.blogsRouter = (0, express_1.Router)({});
class BlogsController {
    constructor() {
        this.blogsService = new blogs_service_1.BlogsService();
        this.postsService = new posts_service_1.PostsService();
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const foundBlogs = yield this.blogsService.findBlogs(pagination);
            res.send(foundBlogs);
        });
    }
    getBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let BlogId = yield this.blogsService.getBlogId(req.params.id);
            if (BlogId) {
                res.send(BlogId);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    getPostsByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.blogId;
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const blog = yield this.blogsService.getBlogId(blogId);
            if (!blog)
                return res.sendStatus(404);
            const foundBlogs = yield this.postsService.findPostsBlogId(pagination, blogId);
            if (foundBlogs) {
                res.send(foundBlogs);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deletBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogId = yield this.blogsService.deleteBlogId(req.params.id);
            if (blogId) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    updateBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const name = req.body.name;
            const description = req.body.description;
            const websiteUrl = req.body.websiteUrl;
            let blogId = yield this.blogsService.updateBlog(name, description, websiteUrl, id);
            if (!blogId) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameBlog = req.body.name;
            const description = req.body.description;
            const websiteUrl = req.body.websiteUrl;
            const newBlog = yield this.blogsService.createBlog(nameBlog, description, websiteUrl);
            res.status(201).send(newBlog);
        });
    }
    createPostByBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const blogId = req.params.blogId;
            const newBlog = yield this.postsService.createdPostBlogId(title, shortDescription, content, blogId);
            if (newBlog != false) {
                res.status(201).send(newBlog);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
const blogsControllerInstance = new BlogsController();
exports.blogsRouter.get('/', blogsControllerInstance.getBlogs.bind(blogsControllerInstance));
exports.blogsRouter.get('/:id', blogsControllerInstance.getBlogId.bind(blogsControllerInstance));
exports.blogsRouter.get('/:blogId/posts', blogsControllerInstance.getPostsByBlogId.bind(blogsControllerInstance));
exports.blogsRouter.delete('/:id', basicAuth_1.authMidleware, blogsControllerInstance.deletBlogId.bind(blogsControllerInstance));
exports.blogsRouter.post('/', basicAuth_1.authMidleware, blogs_validation_1.nameValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, blogsControllerInstance.createBlog.bind(blogsControllerInstance));
exports.blogsRouter.post('/:blogId/posts', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, input_validation_middleware_1.inputValidationMiddleware, blogsControllerInstance.createPostByBlog.bind(blogsControllerInstance));
exports.blogsRouter.put('/:id', basicAuth_1.authMidleware, blogs_validation_1.nameValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, blogsControllerInstance.updateBlogId.bind(blogsControllerInstance));
