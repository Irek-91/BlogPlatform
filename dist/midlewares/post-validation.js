"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.titleValidation = (0, express_validator_1.body)('title').trim().notEmpty().isString().isLength({ max: 30 }).withMessage('error in string length');
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().notEmpty().isLength({ max: 100 }).withMessage('error in shortDescription length');
exports.contentValidation = (0, express_validator_1.body)('content').trim().notEmpty().isString().isLength({ max: 1000 }).withMessage("error in content length");
exports.blogIdValidation = (0, express_validator_1.body)('blogId').trim().notEmpty().isString().withMessage("error in the content").custom((blogId) => {
    const blog = blogs_repository_1.blogsRepository.getBlogId(blogId);
    if (!blog) {
        throw new Error("Blog with this BlogId not found");
    }
    return true;
});
