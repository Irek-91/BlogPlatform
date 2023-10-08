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
exports.BlogsController = void 0;
const pagination_1 = require("../midlewares/pagination");
class BlogsController {
    constructor(blogsService, postsService) {
        this.blogsService = blogsService;
        this.postsService = postsService;
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
            const { userId } = req;
            const blogId = req.params.blogId;
            const pagination = (0, pagination_1.getPaginationFromQuery)(req.query);
            const blog = yield this.blogsService.getBlogId(blogId);
            if (!blog)
                return res.sendStatus(404);
            const foundBlogs = yield this.postsService.findPostsBlogId(pagination, blogId, userId);
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
            const blogName = yield this.blogsService.getBlogNameById(blogId);
            const newPost = yield this.postsService.createdPostBlogId(title, shortDescription, content, blogId, blogName);
            if (newPost != false) {
                res.status(201).send(newPost);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
exports.BlogsController = BlogsController;
