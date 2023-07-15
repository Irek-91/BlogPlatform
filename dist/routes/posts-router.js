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
exports.postsRouter = void 0;
const express_1 = require("express");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const post_validation_1 = require("../midlewares/post-validation");
const basicAuth_1 = require("../midlewares/basicAuth");
const posts_service_1 = require("../domain/posts-service");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = +req.body.pageNumber;
    const pageSize = +req.body.pageSize;
    const sortBy = req.body.sortBy;
    const sortDirections = req.body.sortDirections;
    if (sortDirections === "asc") {
        const sortDirections = 1;
    }
    else {
        const sortDirections = -1;
    }
    const posts = yield posts_service_1.postsService.findPost(pageNumber, pageSize, sortBy, sortDirections);
    res.send(posts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield posts_service_1.postsService.getPostId(req.params.id);
    if (post) {
        res.send(post);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postsRouter.delete('/:id', basicAuth_1.authMidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield posts_service_1.postsService.deletePostId(req.params.id);
    if (post) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postsRouter.post('/', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, post_validation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    let post = yield posts_service_1.postsService.createdPostId(title, shortDescription, content, blogId);
    res.status(201).send(post);
}));
exports.postsRouter.put('/:id', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, post_validation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    let postResult = yield posts_service_1.postsService.updatePostId(id, title, shortDescription, content, blogId);
    if (postResult === true) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
/*postsRouter.delete('/testing/all-data',
  async (req: Request, res: Response) => {
    res.sendStatus(204)
})*/ 
