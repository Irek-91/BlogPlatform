"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDeviceRouter = void 0;
const express_1 = require("express");
const chek_refreshToket_1 = require("../midlewares/chek-refreshToket");
const chek_refreshToket_delete_1 = require("../midlewares/chek-refreshToket-delete");
const composition_root_1 = require("../composition-root");
exports.securityDeviceRouter = (0, express_1.Router)({});
exports.securityDeviceRouter.get('/devices', chek_refreshToket_1.chekRefreshToken, composition_root_1.securityDeviceController.getDeviceByToken.bind(composition_root_1.securityDeviceController));
exports.securityDeviceRouter.delete('/devices', chek_refreshToket_1.chekRefreshToken, composition_root_1.securityDeviceController.deleteAllDevicesExceptOne.bind(composition_root_1.securityDeviceController));
exports.securityDeviceRouter.delete('/devices/:deviceId', chek_refreshToket_delete_1.chekRefreshTokenDeleteDevice, composition_root_1.securityDeviceController.deleteDeviceByUserId.bind(composition_root_1.securityDeviceController));
