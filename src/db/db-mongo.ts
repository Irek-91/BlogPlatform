import {MongoClient, ServerApiVersion, ObjectId} from 'mongodb'
import dotenv from 'dotenv'
import { postsCollectionsType } from '../types/types-db';
dotenv.config()


const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error ('URL doesn\'t found')
}

const client = new MongoClient(mongoUri)

const db = client.db('BlogPlatform');
export const blogsCollections = db.collection('blogs')
export const postsCollections = db.collection('posts')
export const usersCollections = db.collection('users')



export const runDb = async () => {
    try {
        await client.connect();
        console.log('Connected to db');
    } catch (e) {
        console.log('Don\'t connected');
        await client.close()
    }
};