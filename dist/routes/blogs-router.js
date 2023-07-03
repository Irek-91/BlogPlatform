"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const blogs_validation_1 = require("../midlewares/blogs-validation");
const basicAuth_1 = require("../midlewares/basicAuth");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    let foundBlogs = blogs_repository_1.blogsRepository.findBlogs();
    res.send(foundBlogs);
});
exports.blogsRouter.get('/:id', (req, res) => {
    let BlogId = blogs_repository_1.blogsRepository.getBlogId(req.params.id);
    if (BlogId) {
        res.send(BlogId);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogsRouter.delete('/:id', basicAuth_1.authMidleware, (req, res) => {
    let blogId = blogs_repository_1.blogsRepository.deleteBlogId(req.params.id);
    if (blogId) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogsRouter.put('/:id', basicAuth_1.authMidleware, blogs_validation_1.nameValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    let blogId = blogs_repository_1.blogsRepository.updateBlog(name, description, websiteUrl, id);
    if (!blogId) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.blogsRouter.post('/', basicAuth_1.authMidleware, blogs_validation_1.nameValidation, blogs_validation_1.descriptionValidation, blogs_validation_1.websiteUrl, blogs_validation_1.websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const nameBlog = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const newBlog = blogs_repository_1.blogsRepository.createBlog(nameBlog, description, websiteUrl);
    res.status(201).send(newBlog);
});
