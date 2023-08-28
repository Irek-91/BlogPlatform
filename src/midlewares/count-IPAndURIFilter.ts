import { NextFunction, Request, Response } from 'express';
import { arrayIPAndURICollections } from '../db/db-mongo';
import {  addSeconds } from 'date-fns';


export const filterCountIPAndURL = async (req: Request, res: Response, next: NextFunction) => {
    // date.toIsoString()
    // 2000.00
    const connectionDate = new Date()
    const IP = req.ip
    const URL = req.originalUrl //|| req.baseUrl 
    const newAPI = {
        IP,
        URL,
        date: connectionDate.toISOString()
    }
    const count = await arrayIPAndURICollections.countDocuments({IP: newAPI.IP, URL: newAPI.URL, date: {$gte: addSeconds(connectionDate, -10).toISOString()}})

    if (count + 1 > 5) {
        return res.sendStatus(429)
    }
    await arrayIPAndURICollections.insertOne({...newAPI})


    next()
}