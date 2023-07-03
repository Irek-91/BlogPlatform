"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMidleware = void 0;
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const app = require('express')();
exports.authMidleware = app.use((0, express_basic_auth_1.default)({
    users: { 'admin': 'supersecret' }
}));
