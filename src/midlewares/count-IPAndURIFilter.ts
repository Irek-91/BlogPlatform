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

    const countIP = await arrayIPAndURICollections.countDocuments({$or : [{IP: newAPI.IP}, {date: {$gte: new Date((newAPI.date).getTime() - 10000)}}]})
    const countURL = await arrayIPAndURICollections.countDocuments({$or : [{URL: newAPI.URL}, {date: {$gte: new Date((newAPI.date).getTime() - 10000)}}]})

    if (countIP >= 5 || countURL>= 5) {return res.sendStatus(429)}
    const result = await arrayIPAndURICollections.insertOne({...newAPI})

    next()
}