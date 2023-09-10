"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesMongo = void 0;
class DevicesMongo {
    constructor(_id, expirationDate, deviceId, IP, issuedAt, deviceName, userId) {
        this._id = _id;
        this.expirationDate = expirationDate;
        this.deviceId = deviceId;
        this.IP = IP;
        this.issuedAt = issuedAt;
        this.deviceName = deviceName;
        this.userId = userId;
    }
}
exports.DevicesMongo = DevicesMongo;
