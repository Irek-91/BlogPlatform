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
exports.filterCountIPAndURL = void 0;
const date_fns_1 = require("date-fns");
const db_mongoos_1 = require("../db/db-mongoos");
const filterCountIPAndURL = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // date.toIsoString()
    // 2000.00
    const connectionDate = new Date();
    const IP = req.ip;
    const URL = req.originalUrl; //|| req.baseUrl 
    const newAPI = {
        IP,
        URL,
        date: connectionDate.toISOString()
    };
    const count = yield db_mongoos_1.IPAndURIModelClass.countDocuments({ IP: newAPI.IP, URL: newAPI.URL, date: { $gte: (0, date_fns_1.addSeconds)(connectionDate, -10).toISOString() } });
    if (count + 1 > 5) {
        return res.sendStatus(429);
    }
    //await IPAndURIModelClass.insertOne({...newAPI})
    const IPAndURIInstance = new db_mongoos_1.IPAndURIModelClass(newAPI);
    IPAndURIInstance.IP = IP;
    IPAndURIInstance.URL = URL;
    IPAndURIInstance.date = connectionDate.toISOString();
    yield IPAndURIInstance.save();
    next();
});
exports.filterCountIPAndURL = filterCountIPAndURL;
