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
exports.likeStatusValidation1 = exports.LikeStatusValues = exports.LikeStatusEnum = exports.likeStatusValidation = void 0;
const express_validator_1 = require("express-validator");
const likeStatusValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const likeStatus = req.body.likeStatus;
    if (typeof likeStatus !== 'string' || likeStatus !== ('Dislike' || 'None' || 'Like')) {
        res.status(400).send({ errorsMessages: [{
                    message: 'error in likeStatus',
                    field: "likeStatus"
                }]
        });
    }
    else {
        next();
    }
});
exports.likeStatusValidation = likeStatusValidation;
var LikeStatusEnum;
(function (LikeStatusEnum) {
    LikeStatusEnum["Like"] = "Like";
    LikeStatusEnum["Dislike"] = "Dislike";
    LikeStatusEnum["None"] = "None";
})(LikeStatusEnum || (exports.LikeStatusEnum = LikeStatusEnum = {}));
exports.LikeStatusValues = Object.values(LikeStatusEnum);
exports.likeStatusValidation1 = (0, express_validator_1.body)('likeStatus').isString().trim().notEmpty().
    // matches(/'Like'|'None'|'Dislike'/).
    custom((val) => {
    if (!exports.LikeStatusValues.includes(val)) {
        throw new Error('invalid input data');
    }
    return true;
}).
    withMessage('error in likeStatus');
