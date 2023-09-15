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
const get_comments_middleware_1 = require("./../midlewares/get-comments-middleware ");
const express_1 = require("express");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const post_validation_1 = require("../midlewares/post-validation");
const basicAuth_1 = require("../midlewares/basicAuth");
const posts_service_1 = require("../domain/posts-service");
const pagination_1 = require("../midlewares/pagination");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const blogs_service_1 = require("../domain/blogs-service");
const comments_service_1 = require("../domain/comments-service");
exports.postsRouter = (0, express_1.Router)({});
class PostsController {
    constructor() {
        this.postsService = new posts_service_1.PostsService();
        this.blogsService = new blogs_service_1.BlogsService();
        this.commentsService = new comments_service_1.CommentsService();
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const posts = yield this.postsService.findPost(pagination);
            if (!posts) {
                res.sendStatus(404);
            }
            else {
                res.send(posts);
            }
        });
    }
    getPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield this.postsService.getPostId(req.params.id);
            if (post) {
                res.send(post);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    getCommentsBuPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = null;
            if (req.user) {
                userId = req.user._id.toString();
            }
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const postId = req.params.postId;
            const resultPostId = yield this.postsService.getPostId(postId);
            if (resultPostId === false) {
                res.sendStatus(404);
            }
            else {
                const commentsPostId = yield this.commentsService.findCommentsByPostId(postId, userId, pagination);
                if (commentsPostId !== null) {
                    res.send(commentsPostId);
                }
                else {
                    res.sendStatus(404);
                }
            }
        });
    }
    createdPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const blogId = req.body.blogId;
            let post = yield this.postsService.createdPostId(title, shortDescription, content, blogId);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            res.status(201).send(post);
        });
    }
    createdCommentPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(404);
            }
            const postId = req.params.postId;
            const userId = req.user._id.toString();
            const content = req.body.content;
            const post = yield this.postsService.getPostId(postId);
            if (post === false) {
                return res.sendStatus(404);
            }
            let comment = yield this.commentsService.createdCommentPostId(postId, userId, content);
            if (comment === null) {
                res.sendStatus(404);
            }
            else {
                res.status(201).send(comment);
            }
        });
    }
    updatePostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const blogId = req.body.blogId;
            let postResult = yield this.postsService.updatePostId(id, title, shortDescription, content, blogId);
            if (postResult === true) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deletePostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield this.postsService.deletePostId(req.params.id);
            if (post) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
const postsControllerInstance = new PostsController();
exports.postsRouter.get('/', postsControllerInstance.getPosts.bind(postsControllerInstance));
exports.postsRouter.get('/:id', postsControllerInstance.getPostId.bind(postsControllerInstance));
exports.postsRouter.get('/:postId/comments', get_comments_middleware_1.getCommentsMiddleware, postsControllerInstance.getCommentsBuPostId.bind(postsControllerInstance));
exports.postsRouter.post('/', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, post_validation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, postsControllerInstance.createdPostId.bind(postsControllerInstance));
exports.postsRouter.post('/:postId/comments', auth_middleware_1.authMiddleware, post_validation_1.contentCommentValidation, input_validation_middleware_1.inputValidationMiddleware, postsControllerInstance.createdCommentPostId.bind(postsControllerInstance));
exports.postsRouter.put('/:id', basicAuth_1.authMidleware, post_validation_1.titleValidation, post_validation_1.shortDescriptionValidation, post_validation_1.contentValidation, post_validation_1.blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, postsControllerInstance.updatePostId.bind(postsControllerInstance));
exports.postsRouter.delete('/:id', basicAuth_1.authMidleware, postsControllerInstance.deletePostId.bind(postsControllerInstance));
