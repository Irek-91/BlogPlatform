import {MongoClient, ServerApiVersion, ObjectId} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error ('URL doesn\'t found')
}

const client = new MongoClient(mongoUri)

/*const db = client.db('BlogPlatform');
export const blogsCollections = db.collection<blogMongoDB>('blogs')
export const postsCollections = db.collection<postMongoDb>('posts')
export const usersCollections = db.collection<userMongoModel>('users')
export const commentsCollections = db.collection<commentMongoModel>('comments')
export const deviceTokenCollections = db.collection<devicesMongo>('DevicesModelClass')
export const arrayIPAndURICollections = db.collection<arrayIPAndURL>('arrayIPAndURL')
*/




export const runDb = async () => {
    try {
        await client.connect();
        console.log('Connected to db');
    } catch (e) {
        console.log('Don\'t connected');
        await client.close()
    }
};