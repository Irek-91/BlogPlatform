"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    /*const errorFormatter = (error.msg, error.location) => {
       return {message:  , field:  };
     };*/
    const errorFormatter = ({ msg, type }) => {
        return {
            message: msg,
            field: type
        };
    };
    const errors = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({ errorsMessages: errors.array({ onlyFirstError: true }) });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
