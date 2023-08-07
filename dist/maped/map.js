"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsOutput = void 0;
const postsOutput = (posts) => {
    return posts.map((b) => {
        return {
            title: b.title,
            shortDescription: b.shortDescription,
            content: b.content,
            blogId: b.blogId,
            blogName: b.blogName,
            createdAt: b.createdAt,
        };
    });
};
exports.postsOutput = postsOutput;
