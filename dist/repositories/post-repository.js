"use strict";
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
        return posts;
    },
    getPostId(id) {
        let post = posts.find(p => p.id === id);
        return post;
    },
    deletePostId(id) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    createdPostId(title, shortDescription, content, blogId) {
        const blog = blogs_repository_1.blogsRepository.getBlogId(blogId);
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
    },
    updatePostId(id, title, shortDescription, content, blogId) {
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
    },
    deletePostAll() {
        posts.length = 0;
        return true;
    }
};
