"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogMongoDB = exports.PostMongoDb = void 0;
class PostMongoDb {
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
    }
}
exports.PostMongoDb = PostMongoDb;
class BlogMongoDB {
    constructor(_id, name, description, websiteUrl, createdAt, isMembership) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
    }
}
exports.BlogMongoDB = BlogMongoDB;
