"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const posts = [
    {
        id: 1,
        title: "post1",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "string"
    },
    {
        id: 2,
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
        const newPost = {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: "string"
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
    }
};
