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
exports.CommentsController = exports.commentsRouter = void 0;
const post_validation_1 = require("./../midlewares/post-validation");
const express_1 = require("express");
const auth_middleware_1 = require("../midlewares/auth-middleware");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
const like_status_validation_1 = require("../midlewares/like_status_validation");
const get_comments_middleware_1 = require("../midlewares/get-comments-middleware ");
const composition_root_1 = require("../composition-root");
exports.commentsRouter = (0, express_1.Router)({});
class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    findCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            let commentId = yield this.commentsService.findCommentById(req.params.id, userId);
            if (commentId === null) {
                return res.sendStatus(404);
            }
            else {
                res.status(200).send(commentId);
            }
        });
    }
    updateCommentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(401);
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
                return res.sendStatus(401);
            }
            const commentId = req.params.commentsId;
            const userId = req.user._id.toString();
            const likeStatus = req.body.likeStatus;
            const resultUpdateLikeStatusCommen = yield this.commentsService.updateLikeStatus(commentId, userId, likeStatus);
            if (resultUpdateLikeStatusCommen) {
                return res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                return res.sendStatus(401);
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
exports.CommentsController = CommentsController;
exports.commentsRouter.get('/:id', get_comments_middleware_1.getUserMiddleware, composition_root_1.commentsController.findCommentById.bind(composition_root_1.commentsController));
exports.commentsRouter.put('/:commentsId', auth_middleware_1.authMiddleware, post_validation_1.contentCommentValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.commentsController.updateCommentId.bind(composition_root_1.commentsController));
exports.commentsRouter.put('/:commentsId/like-status', auth_middleware_1.authMiddleware, like_status_validation_1.likeStatusValidation1, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.commentsController.updateStatusByCommentId.bind(composition_root_1.commentsController));
exports.commentsRouter.delete('/:commentsId', auth_middleware_1.authMiddleware, composition_root_1.commentsController.deleteCommentById.bind(composition_root_1.commentsController));
