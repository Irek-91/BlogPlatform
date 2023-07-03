"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const blogs = [
    {
        id: "1",
        name: "name1",
        description: "description",
        websiteUrl: "websiteUrl"
    },
    {
        id: "2",
        name: "name2",
        description: "description",
        websiteUrl: "websiteUrl"
    }
];
exports.blogsRepository = {
    findBlogs() {
        return blogs;
    },
    getBlogId(id) {
        let blog = blogs.find(p => p.id === id);
        return blog;
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = {
            id: String(+new Date()),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(name, description, websiteUrl, id) {
        let apiErrorResult = [];
        let blog = blogs.find(p => p.id === id);
        if (!blog) {
            return false;
        }
        else {
            blog.name = name;
            blog.description = description;
            blog.websiteUrl = websiteUrl;
            return true;
        }
    },
    deleteBlogId(id) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    deleteBlogAll() {
        blogs.length = 0;
        return true;
    }
};
