"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPAndURIShema = exports.DevicesModelClassShema = exports.commentsShema = exports.likeInfoShema = exports.commentatorInfoShema = exports.userViewModelShema = exports.usersShema = exports.emailConfirmationShema = exports.accountDataShema = exports.postsShema = exports.blogsShema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.blogsShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
});
exports.postsShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
});
exports.accountDataShema = new mongoose_1.default.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true },
    salt: { type: String, required: true },
    hash: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.emailConfirmationShema = new mongoose_1.default.Schema({
    confirmationCode: { type: String, required: true },
    expiritionDate: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true },
    recoveryCode: { type: String, required: true }
});
exports.usersShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    accountData: { type: exports.accountDataShema, required: true },
    emailConfirmation: { type: exports.emailConfirmationShema, required: true }
});
exports.userViewModelShema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.commentatorInfoShema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
}, { _id: false });
exports.likeInfoShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    commentsId: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, required: true }
});
exports.commentsShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: { type: exports.commentatorInfoShema, required: true },
    createdAt: { type: String, required: true },
    likesCount: { type: Number, required: true },
    dislikesCount: { type: Number, required: true },
    //likes:{type: [likeInfoShema], required: true}
});
exports.DevicesModelClassShema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    issuedAt: { type: String, required: true },
    expirationDate: { type: String, required: true },
    deviceId: { type: String, required: true },
    IP: { type: String, required: true },
    deviceName: { type: String, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true }
});
exports.IPAndURIShema = new mongoose_1.default.Schema({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: String, required: true }
});
/*
export const paginatorBlogShema = new mongoose.Schema({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [blogOutputShema]}
})

export const paginatorPostShema = new mongoose.Schema<paginatorPost>({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [postOutputShema]}
})



export const paginatorUserShema = new mongoose.Schema({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [userViewModelShema]}
})

export const paginatorCommentsShema = new mongoose.Schema({
    pagesCount: {type: Number},
    page: {type: Number},
    pageSize: {type: Number},
    totalCount: {type: Number},
    items: {type: [commentViewModelShema]}
})

*/
