"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const post_repository_1 = require("../repositories/post-repository");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const post_validation_1 = require("../midlewares/post-validation");
const basicAuth_1 = require("../midlewares/basicAuth");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    let posts = post_repository_1.postRepository.findPost();
    res.send(posts);
});
exports.postsRouter.get('/:id', (req, res) => {
    let post = post_repository_1.postRepository.getPostId(req.params.id);
    if (post) {
        res.send(post);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postsRouter.delete('/:id', basicAuth_1.authMidleware, (req, res) => {
    let post = post_repository_1.postRepository.deletePostId(req.params.id);
    if (post) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postsRouter.post('/', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, post_validation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    let post = post_repository_1.postRepository.createdPostId(title, shortDescription, content, blogId);
    res.status(201).send(post);
});
exports.postsRouter.put('/:id', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, post_validation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    let postResult = post_repository_1.postRepository.updatePostId(id, title, shortDescription, content, blogId);
    if (postResult) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
