"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteUrlLength = exports.websiteUrl = exports.descriptionValidation = exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)('name').trim().notEmpty().
    isString().isLength({ max: 15 })
    .withMessage('error in name length');
exports.descriptionValidation = (0, express_validator_1.body)('description').trim().notEmpty().
    isLength({ max: 500 }).withMessage('error in description length');
exports.websiteUrl = (0, express_validator_1.body)('websiteUrl').trim().
    notEmpty().
    matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').
    withMessage("error in the websiteUrl, not pattern");
exports.websiteUrlLength = (0, express_validator_1.body)('websiteUrl').isString().
    isLength({ max: 100 }).
    withMessage("error in websiteUrl length");
