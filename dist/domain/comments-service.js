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
exports.commentsService = void 0;
const comments_db_repository_1 = require("../repositories/comments-db-repository");
const users_db_repository_1 = require("../repositories/users-db-repository");
exports.commentsService = {
    createdCommentPostId(postId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const user = yield users_db_repository_1.userRepository.findUserById(userId);
            if (!user) {
                return null;
            }
            const newComment = {
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: user.login,
                },
                createdAt: createdAt
            };
            const creatComment = yield comments_db_repository_1.commentsRepository.createdCommentPostId(newComment);
            return creatComment;
        });
    },
    findCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_db_repository_1.commentsRepository.findCommentById(id);
            if (comment === null) {
                return null;
            }
            else {
                return comment;
            }
        });
    },
    updateContent(userId, commentsId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield comments_db_repository_1.commentsRepository.findCommentById(commentsId);
                if (comment.commentatorInfo.userId === userId) {
                    const result = yield comments_db_repository_1.commentsRepository.updateCommentId(commentsId, content);
                    return result;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteCommentById(commentsId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commentById = yield comments_db_repository_1.commentsRepository.findCommentById(commentsId);
                if (commentById === null) {
                    return null;
                }
                if (commentById.commentatorInfo.userId === userId) {
                    const result = yield comments_db_repository_1.commentsRepository.deletCommentById(commentsId);
                    return result;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return null;
            }
        });
    },
    findCommentsByPostId(postId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_db_repository_1.commentsRepository.findCommentsByPostId(postId, pagination);
        });
    }
};
