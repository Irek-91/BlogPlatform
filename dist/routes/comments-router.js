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
exports.commentsRouter = void 0;
const post_validation_1 = require("./../midlewares/post-validation");
const express_1 = require("express");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const comments_service_1 = require("../domain/comments-service");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let commentId = yield comments_service_1.commentsService.findCommentById(req.params.id);
    if (commentId === null) {
        res.sendStatus(404);
    }
    else {
        res.status(200).send(commentId);
    }
}));
exports.commentsRouter.put('/:commentsId', auth_middleware_1.authMiddleware, post_validation_1.contentCommentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.sendStatus(404);
    }
    const commentsId = req.params.commentsId;
    const userId = req.user._id.toString();
    const content = req.body.content;
    let resultContent = yield comments_service_1.commentsService.updateContent(userId, commentsId, content);
    if (resultContent === false) {
        res.sendStatus(403);
    }
    else if (resultContent === true) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.commentsRouter.delete('/:commentsId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.sendStatus(404);
    }
    const commentsId = req.params.commentsId;
    const userId = req.user._id.toString();
    const result = yield comments_service_1.commentsService.deleteCommentById(commentsId, userId);
    if (result === false) {
        res.sendStatus(403);
    }
    if (result === true) {
        res.sendStatus(204);
    }
    if (result === null) {
        res.sendStatus(404);
    }
}));
