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
exports.PostsController = void 0;
const pagination_1 = require("../midlewares/pagination");
class PostsController {
    constructor(postsService, blogsService, commentsService) {
        this.postsService = postsService;
        this.blogsService = blogsService;
        this.commentsService = commentsService;
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const { userId } = req;
            const posts = yield this.postsService.findPost(pagination, userId);
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
            const { userId } = req;
            let post = yield this.postsService.getPostId(req.params.id, userId);
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
            const { userId } = req;
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const postId = req.params.postId;
            const resultPostId = yield this.postsService.getPostId(postId, userId);
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
            const blogName = yield this.blogsService.getBlogNameById(blogId);
            let post = yield this.postsService.createdPostBlogId(title, shortDescription, content, blogId, blogName);
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
            const post = yield this.postsService.getPostId(postId, userId);
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
    updateLikeStatusPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(404);
            }
            const postId = req.params.postId;
            const userId = req.user._id.toString();
            const likeStatus = req.body.likeStatus;
            const resultUpdateLikeStatusPost = yield this.postsService.updateLikeStatusPostId(postId, userId, likeStatus);
            if (resultUpdateLikeStatusPost) {
                return res.sendStatus(204);
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
exports.PostsController = PostsController;
