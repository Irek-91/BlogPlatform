import {MongoClient, ServerApiVersion, ObjectId} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error ('URL doesn\'t found')
}

const client = new MongoClient(mongoUri)

export const runDb = async () => {
    try {
        await client.connect();
        console.log('Connected to db');
    } catch (e) {
        console.log('Don\'t connected');
        await client.close()
    }
};