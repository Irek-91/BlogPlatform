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
exports.contentCommentValidation = exports.blogIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.titleValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
exports.titleValidation = (0, express_validator_1.body)('title').trim().notEmpty().isString().isLength({ max: 30 }).withMessage('error in string length');
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().notEmpty().isLength({ max: 100 }).withMessage('error in shortDescription length');
exports.contentValidation = (0, express_validator_1.body)('content').trim().notEmpty().isString().isLength({ max: 1000 }).withMessage("error in content length");
exports.blogIdValidation = (0, express_validator_1.body)('blogId').trim().notEmpty().isString().withMessage("error in the content").custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_db_repository_1.blogsRepository.getBlogId(blogId);
    if (!blog) {
        throw new Error("Blog with this BlogId not found");
    }
    return true;
}));
exports.contentCommentValidation = (0, express_validator_1.body)('content').trim().notEmpty().isString().isLength({ min: 20, max: 300 }).withMessage('error in string length');
