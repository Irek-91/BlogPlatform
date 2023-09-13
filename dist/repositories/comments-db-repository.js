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
    createdCommentPostId(postId, content, userId, userLogin, createdAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCommentId = new mongodb_1.ObjectId();
            const newComment = {
                _id: newCommentId,
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: userLogin
                },
                createdAt: createdAt,
                likesCount: 0,
                dislikesCount: 0,
            };
            const newLike = {
                _id: new mongodb_1.ObjectId(),
                userId: userId,
                commentsId: newCommentId.toString(),
                status: 'None',
                createdAt: new Date().toISOString()
            };
            const commentsInstance = new db_mongoos_1.CommentsModelClass(newComment);
            const newLikeInstance = new db_mongoos_1.LikesModelClass(newLike);
            yield commentsInstance.save();
            yield newLikeInstance.save();
            return {
                id: commentsInstance._id.toString(),
                content: commentsInstance.content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: userLogin
                },
                createdAt: commentsInstance.createdAt,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            };
        });
    },
    findCommentById(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield db_mongoos_1.CommentsModelClass.findOne({ _id: new mongodb_1.ObjectId(commentId) });
                if (!comment) {
                    return null;
                }
                let myStatusLike = '';
                const like = yield db_mongoos_1.LikesModelClass.findOne({ userId: userId });
                if (!like) {
                    myStatusLike = 'None';
                }
                else {
                    myStatusLike = like.status;
                }
                const commentViewModel = {
                    id: comment._id.toString(),
                    content: comment.content,
                    commentatorInfo: comment.commentatorInfo,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesCount,
                        dislikesCount: comment.dislikesCount,
                        myStatus: myStatusLike
                    }
                };
                return commentViewModel;
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
    findCommentsByPostId(postId, userId, pagination) {
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
                const like = yield db_mongoos_1.LikesModelClass.find({ userId: userId }).lean();
                const commentsOutput = comments.map((c) => {
                    return {
                        id: c._id.toString(),
                        content: c.content,
                        commentatorInfo: c.commentatorInfo,
                        createdAt: c.createdAt,
                        likesInfo: {
                            likesCount: c.likesCount,
                            dislikesCount: c.dislikesCount,
                            myStatus: (like.filter((like) => { if (like.commentsId === (c._id).toString()) {
                                return like.status;
                            }
                            else {
                                return 'None';
                            } })).join()
                        }
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
    updateLikeStatus(commentId, userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield db_mongoos_1.CommentsModelClass.findOne({ _id: new mongodb_1.ObjectId(commentId) });
                if (!comment) {
                    return null;
                }
                const like = yield db_mongoos_1.LikesModelClass.findOne({ commentsId: commentId });
                if (!like) {
                    const newLike = {
                        _id: new mongodb_1.ObjectId(),
                        userId: userId,
                        commentsId: commentId,
                        status: likeStatus,
                        createdAt: new Date().toISOString()
                    };
                    const newLikeInstance = new db_mongoos_1.LikesModelClass(newLike);
                    yield newLikeInstance.save();
                    if (likeStatus === 'Like') {
                        comment.likesCount += 1;
                        yield comment.save();
                    }
                    else {
                        comment.dislikesCount += 1;
                        yield comment.save();
                    }
                    return true;
                }
                else {
                    if (like.status === likeStatus) {
                        return true;
                    }
                    like.status = likeStatus;
                    yield like.save();
                    if (likeStatus === 'Like') {
                        comment.likesCount += 1;
                        comment.dislikesCount -= 1;
                        yield comment.save();
                    }
                    else {
                        comment.dislikesCount += 1;
                        comment.likesCount -= 1;
                        yield comment.save();
                    }
                    return true;
                }
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteCommentsAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongoos_1.CommentsModelClass.deleteMany({});
            const deletResult1 = yield db_mongoos_1.LikesModelClass.deleteMany({});
            return true;
        });
    }
};
