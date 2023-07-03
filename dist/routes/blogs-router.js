"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
exports.blogsRouter = (0, express_1.Router)({});
const nameValidation = (0, express_validator_1.body)('name').trim().notEmpty().isString().isLength({ max: 15 }).withMessage('error in name length');
const descriptionValidation = (0, express_validator_1.body)('description').trim().notEmpty().isLength({ max: 500 }).withMessage('error in description length');
const websiteUrl = (0, express_validator_1.body)('websiteUrl').trim().notEmpty().matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').withMessage("error in the websiteUrl, not pattern");
const websiteUrlLength = (0, express_validator_1.body)('websiteUrl').isString().isLength({ max: 100 }).withMessage("error in websiteUrl length");
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
exports.blogsRouter.delete('/:id', (req, res) => {
    let blogId = blogs_repository_1.blogsRepository.deleteBlogId(req.params.id);
    if (blogId) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogsRouter.put('/:id', nameValidation, descriptionValidation, websiteUrl, websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
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
exports.blogsRouter.post('/', nameValidation, descriptionValidation, websiteUrl, websiteUrlLength, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const nameBlog = req.body.name;
    const description = req.body.description;
    const websiteUrl = req.body.websiteUrl;
    const newBlog = blogs_repository_1.blogsRepository.createBlog(nameBlog, description, websiteUrl);
    res.status(201).send(newBlog);
});
