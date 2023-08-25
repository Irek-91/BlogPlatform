import { NextFunction, Request, Response } from 'express';
import { arrayIPAndURICollections } from '../db/db-mongo';


export const filterCountIPAndURL = async (req: Request, res: Response, next: NextFunction) => {
    // date.toIsoString()
    // 2000.00
    const IP = req.ip
    const URL =  req.baseUrl || req.originalUrl //log  ()
    const newAPI = {
        IP,
        URL,
        date: new Date()
    }

    const count = await arrayIPAndURICollections.countDocuments({date: {$gte: new Date((newAPI.date).getTime() - 10000)}})
    if (count >= 5) {return res.sendStatus(429)}
    const result = await arrayIPAndURICollections.insertOne({...newAPI})

    next()
}