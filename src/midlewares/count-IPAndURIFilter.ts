import { NextFunction, Request, Response } from 'express';
import { addSeconds } from 'date-fns';
import { IPAndURIModelClass } from '../db/db-mongoos';


export const filterCountIPAndURL = async (req: Request, res: Response, next: NextFunction) => {
    const connectionDate = new Date()
    const IP = req.ip
    const URL = req.originalUrl //|| req.baseUrl 
    const newAPI = {
        IP,
        URL,
        date: connectionDate.toISOString()
    }
    const count = await IPAndURIModelClass.countDocuments({ IP: newAPI.IP, 
        URL: newAPI.URL, 
        date: { $gte: addSeconds(connectionDate, -10).toISOString() } 
    })

    if (count + 1 > 5) {
        return res.sendStatus(429)
    }
    const IPAndURIInstance = new IPAndURIModelClass()
    IPAndURIInstance.IP = IP
    IPAndURIInstance.URL = URL
    IPAndURIInstance.date = connectionDate.toISOString()
    await IPAndURIInstance.save()
    next()
}