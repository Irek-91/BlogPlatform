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
exports.tokensRepository = void 0;
const db_mongoos_1 = require("../db/db-mongoos");
exports.tokensRepository = {
    addRefreshToken(newDeviceAndRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.insertMany(Object.assign({}, newDeviceAndRefreshToken));
                return true;
            }
            catch (e) {
                return null;
            }
        });
    },
    getUserIdByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.findOne({ deviceId: deviceId }).lean();
                if (res === null) {
                    return null;
                }
                return res.userId;
            }
            catch (e) {
                return null;
            }
        });
    },
    findTokenAndDeviceByissuedAt(issuedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.findOne({ issuedAt: issuedAt });
                if (res === null) {
                    return null;
                }
                return true;
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteTokenAndDevice(issuedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.deleteOne({ issuedAt: issuedAt });
                if (res === null) {
                    return null;
                }
                return true;
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteTokensAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const deletResult = yield db_mongoos_1.DevicesModelClass.deleteMany({});
            return true;
        });
    },
    getTokenAndDevice(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.find({ userId: userId }).lean();
                if (res === null) {
                    return null;
                }
                return res;
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.deleteOne({ deviceId: deviceId });
                if (res === null) {
                    return null;
                }
                return res.acknowledged;
            }
            catch (e) {
                return null;
            }
        });
    },
    deleteAllDevicesExceptOne(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //добавить фильтр по userId
            try {
                const checkUserIdByDeviceId = yield db_mongoos_1.DevicesModelClass.find({ userId: userId, deviceId: deviceId });
                if (checkUserIdByDeviceId.length === 0) {
                    return null;
                }
                const res = yield db_mongoos_1.DevicesModelClass.deleteMany({ deviceId: { $ne: deviceId } });
                if (res === null) {
                    return null;
                }
                return res.acknowledged;
            }
            catch (e) {
                return null;
            }
        });
    },
    findOneDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield db_mongoos_1.DevicesModelClass.findOne({ deviceId: deviceId });
                if (res === null) {
                    return null;
                }
                return res;
            }
            catch (e) {
                return null;
            }
        });
    }
};
