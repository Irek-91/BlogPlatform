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
exports.commentsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_mongoos_1 = require("../db/db-mongoos");
exports.commentsRepository = {
    createdCommentPostId(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            //const res = await CommentsModelClass.insertMany({ ...comment, _id: new ObjectId()})
            const commentsInstance = new db_mongoos_1.CommentsModelClass(comment);
            commentsInstance._id = new mongodb_1.ObjectId();
            yield commentsInstance.save();
            return {
                id: commentsInstance._id.toString(),
                content: commentsInstance.content,
                commentatorInfo: commentsInstance.commentatorInfo,
                createdAt: commentsInstance.createdAt
            };
        });
    },
    findCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield db_mongoos_1.CommentsModelClass.findOne({ _id: new mongodb_1.ObjectId(commentId) });
                if (comment !== null) {
                    const commentViewModel = {
                        id: comment._id.toString(),
                        content: comment.content,
                        commentatorInfo: comment.commentatorInfo,
                        createdAt: comment.createdAt
                    };
                    return commentViewModel;
                }
                else {
                    return null;
                }
            }
            catch (e) {
                return null;
            }
        });
    },
    updateCommentId(commentsId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield db_mongoos_1.CommentsModelClass.updateOne({ _id: new mongodb_1.ObjectId(commentsId) }, { $set: { content } });
                if (post.matchedCount) {
                    return true;
                }
                else {
                    return null;
                }
            }
            catch (e) {
                return null;
            }
        });
    },
    deletCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_mongoos_1.CommentsModelClass.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (result.deletedCount) {
                    return true;
                }
                else {
                    return null;
                }
            }
            catch (e) {
                return null;
            }
        });
    },
    findCommentsByPostId(postId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { postId: postId };
                const comments = yield db_mongoos_1.CommentsModelClass.find(filter).
                    sort([[pagination.sortBy, pagination.sortDirection]]).
                    skip(pagination.skip).
                    limit(pagination.pageSize).
                    lean();
                const totalCOunt = yield db_mongoos_1.CommentsModelClass.countDocuments(filter);
                const pagesCount = Math.ceil(totalCOunt / pagination.pageSize);
                const commentsOutput = comments.map((c) => {
                    return {
                        id: c._id.toString(),
                        content: c.content,
                        commentatorInfo: c.commentatorInfo,
                        createdAt: c.createdAt
                    };
                });
                return { pagesCount: pagesCount,
                    page: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    totalCount: totalCOunt,
                    items: commentsOutput
                };
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteCommentsAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongoos_1.CommentsModelClass.deleteMany({});
            return true;
        });
    }
};
