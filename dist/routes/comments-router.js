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
const jwt_service_1 = require("../application/jwt-service");
exports.commentsRouter = (0, express_1.Router)({});
class CommentsController {
    constructor() {
        this.commentsService = new comments_service_1.CommentsService();
    }
    findCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.cookies.accessToken;
            const userId = (jwt_service_1.jwtService.getUserIdByToken(accessToken)).toString();
            if (userId === null) {
                res.sendStatus(404);
            }
            let commentId = yield this.commentsService.findCommentById(req.params.id, userId);
            if (commentId === null) {
                res.sendStatus(404);
            }
            else {
                res.status(200).send(commentId);
            }
        });
    }
    updateCommentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(404);
            }
            const commentsId = req.params.commentsId;
            const userId = req.user._id.toString();
            const content = req.body.content;
            let resultContent = yield this.commentsService.updateContent(userId, commentsId, content);
            if (resultContent === false) {
                res.sendStatus(403);
            }
            else if (resultContent === true) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    updateStatusByCommentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(404);
            }
            const commentId = req.params.commentsId;
            const userId = req.user._id.toString();
            const likeStatus = req.body.likeStatus;
            const resultCommentId = yield this.commentsService.findCommentById(commentId, userId);
            if (!resultCommentId) {
                return res.sendStatus(404);
            }
            const resultUpdateLikeStatusCommen = yield this.commentsService.updateLikeStatus(commentId, userId, likeStatus);
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(404);
            }
            const commentsId = req.params.commentsId;
            const userId = req.user._id.toString();
            const result = yield this.commentsService.deleteCommentById(commentsId, userId);
            if (result === false) {
                res.sendStatus(403);
            }
            if (result === true) {
                res.sendStatus(204);
            }
            if (result === null) {
                res.sendStatus(404);
            }
        });
    }
}
const commentsControllerInstance = new CommentsController();
exports.commentsRouter.get('/:id', commentsControllerInstance.findCommentById.bind(commentsControllerInstance));
exports.commentsRouter.put('/:commentsId', auth_middleware_1.authMiddleware, post_validation_1.contentCommentValidation, input_validation_middleware_1.inputValidationMiddleware, commentsControllerInstance.updateCommentId.bind(commentsControllerInstance));
exports.commentsRouter.put('/:commentsId/like-status', auth_middleware_1.authMiddleware, input_validation_middleware_1.inputValidationMiddleware, commentsControllerInstance.updateStatusByCommentId.bind(commentsControllerInstance));
exports.commentsRouter.delete('/:commentsId', auth_middleware_1.authMiddleware, commentsControllerInstance.deleteCommentById.bind(commentsControllerInstance));
