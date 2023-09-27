import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { blogsShema } from '../types/types-blogs';
import { likePostInfoShema, postsShema } from '../types/types-posts';
import { usersShema } from '../types/user';
import { DevicesModelClassShema, IPAndURIShema, commentsShema, likeInfoShema } from './mongoosShema';
dotenv.config()

let dbName = 'BlogPlatform'

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error ('URL doesn\'t found')
}



export const BlogsModelClass = mongoose.model('blogs', blogsShema)
export const PostsModelClass = mongoose.model('posts', postsShema)
export const UsersModelClass = mongoose.model('users', usersShema)
export const CommentsModelClass = mongoose.model('comments', commentsShema)
export const LikesModelClass = mongoose.model('likes', likeInfoShema)
export const LikesPostsClass = mongoose.model('likes_posts', likePostInfoShema)
export const DevicesModelClass = mongoose.model('DevicesModelClass', DevicesModelClassShema)
export const IPAndURIModelClass = mongoose.model('IPAndURIShema', IPAndURIShema)

export const runDbMongoose = async () => {
    try {
        //await client.connect();
        await mongoose.connect(mongoUri, {dbName: "BlogPlatform"});
        console.log('Connected to db mongoose');
    } catch (e) {
        console.log('Don\'t connected');
        //await client.close()
        await mongoose.disconnect()
    }
};