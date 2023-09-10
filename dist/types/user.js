"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMongoModel = void 0;
class UserMongoModel {
    constructor(_id, accountData, emailConfirmation) {
        this._id = _id;
        this.accountData = accountData;
        this.emailConfirmation = emailConfirmation;
    }
}
exports.UserMongoModel = UserMongoModel;
