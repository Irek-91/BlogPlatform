import { NextFunction, Request, Response } from 'express';
import { arrayIPAndURICollections } from '../db/db-mongo';


export const filterCountIPAndURL = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip
    const URL =  req.baseUrl || req.originalUrl
    const newAPI = {
        IP,
        URL,
        date: new Date()
    }

    const result = await arrayIPAndURICollections.insertOne({...newAPI})
    const count = await arrayIPAndURICollections.find({date: {$gt: new Date((new Date()).getTime() - 10000)}}).toArray()
    if (count.length > 5) {return res.sendStatus(429)}
    next()
}