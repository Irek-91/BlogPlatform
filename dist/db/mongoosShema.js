"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPAndURIShema = exports.DevicesModelClassShema = exports.commentsShema = exports.likeInfoShema = exports.commentatorInfoShema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
    }
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
