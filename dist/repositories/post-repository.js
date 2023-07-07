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
exports.postRepository = void 0;
const blogs_repository_1 = require("./blogs-repository");
const posts = [
    {
        id: '1',
        title: "post1",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "string"
    },
    {
        id: '2',
        title: "post1",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "string"
    }
];
exports.postRepository = {
    findPost() {
        return __awaiter(this, void 0, void 0, function* () {
            return posts;
        });
    },
    getPostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = posts.find(p => p.id === id);
            return post;
        });
    },
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === id) {
                    posts.splice(i, 1);
                    return true;
                }
            }
            return false;
        });
    },
    createdPostId(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.getBlogId(blogId);
            const newPost = {
                id: String(+(new Date())),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name
            };
            posts.push(newPost);
            return newPost;
        });
    },
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = posts.find(p => p.id === id);
            if (post) {
                post.title = title;
                post.shortDescription = shortDescription;
                post.content = content;
                post.blogId = blogId;
                return true;
            }
            else {
                return false;
            }
        });
    },
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            posts.length = 0;
            return true;
        });
    }
};
