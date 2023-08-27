import { NextFunction, Request, Response } from 'express';
import { arrayIPAndURICollections } from '../db/db-mongo';


export const filterCountIPAndURL = async (req: Request, res: Response, next: NextFunction) => {
    // date.toIsoString()
    // 2000.00
    const IP = req.ip
    const URL =  req.originalUrl // req.baseUrl  log  ()
    console.log(URL)

    const newAPI = {
        IP,
        URL,
        date: (new Date()).toISOString()
    }
    const filterDate = (new Date((new Date(newAPI.date)).setSeconds(-10))).toISOString()
    const result = await arrayIPAndURICollections.insertOne({...newAPI})

    const count = await arrayIPAndURICollections.countDocuments({date: {$gte: filterDate}})

    if (count >= 5) {return res.sendStatus(429)}

    next()
}