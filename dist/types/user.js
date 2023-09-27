"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersShema = exports.emailConfirmationShema = exports.accountDataShema = exports.UserMongoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class UserMongoModel {
    constructor(_id, accountData, emailConfirmation) {
        this._id = _id;
        this.accountData = accountData;
        this.emailConfirmation = emailConfirmation;
    }
}
exports.UserMongoModel = UserMongoModel;
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
