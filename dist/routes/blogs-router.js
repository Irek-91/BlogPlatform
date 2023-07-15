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
const express_1 = require("express");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const blogs_validation_1 = require("../midlewares/blogs-validation");
const basicAuth_1 = require("../midlewares/basicAuth");
const blogs_service_1 = require("../domain/blogs-service");
const posts_service_1 = require("../domain/posts-service");
const post_validation_1 = require("../midlewares/post-validation");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchNameTerm = req.body.searchNameTerm;
    const sortBy = req.body.sortBy;
    const sortDirection = req.body.sortDirection;
    const pageNumber = +req.body.pageNumber;
    const pageSize = +req.body.pageSize;
    if (sortDirection === "asc") {
        const sortDirection = 1;
    }
    else {
        const sortDirection = -1;
    }
    const foundBlogs = yield blogs_service_1.blogsService.findBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize);
    res.send(foundBlogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let BlogId = yield blogs_service_1.blogsService.getBlogId(req.params.id);
    if (BlogId) {
        res.send(BlogId);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.get('/:blogId/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sortBy = req.body.sortBy;
    const sortDirection = req.body.sortDirection;
    const pageNumber = +req.body.pageNumber;
    const pageSize = +req.body.pageSize;
    if (sortDirection === "asc") {
        const sortDirection = 1;
    }
    else {
        const sortDirection = -1;
    }
    const blogId = req.params.blogId;
    const foundBlogs = yield posts_service_1.postsService.findPostsBlogId(pageNumber, pageSize, sortBy, sortDirection, blogId);
    if (foundBlogs) {
        res.send(foundBlogs);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.delete('/:id', basicAuth_1.authMidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let blogId = yield blogs_service_1.blogsService.deleteBlogId(req.params.id);
    if (blogId) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.put('/:id', basicAuth_1.authMidleware, blogs_validation_1.nameValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    let blogId = yield blogs_service_1.blogsService.updateBlog(name, description, websiteUrl, id);
    if (!blogId) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
}));
exports.blogsRouter.post('/', basicAuth_1.authMidleware, blogs_validation_1.nameValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nameBlog = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const newBlog = yield blogs_service_1.blogsService.createBlog(nameBlog, description, websiteUrl);
    res.status(201).send(newBlog);
}));
exports.blogsRouter.post('/:blogId/posts', basicAuth_1.authMidleware, post_validation_1.titleValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const blogId = req.params.blogId;
    const newBlog = yield posts_service_1.postsService.createdPostId(title, description, websiteUrl, blogId);
    res.status(201).send(newBlog);
}));
/*blogsRouter.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepository.deleteBlogAll();
    res.sendStatus(204)
  })*/ 
