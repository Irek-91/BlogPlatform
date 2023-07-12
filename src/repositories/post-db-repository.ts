import { blogsRepository } from "./blogs-db-repository";
import { postsCollections } from "../db/db-mongo";
import { post, postMongoDb, postOutput, postsCollectionsType } from "../types/types-db";
import { ObjectId } from "mongodb";


export const postRepository = {
    
    async findPost() {
        
        const posts = await postsCollections.find({}).toArray();
        const postOuput = posts.map((b) => {
            return {
                id: b._id,
                title: b.title,
                shortDescription: b.shortDescription,
                content: b.content,
                blogId: b.blogId,
                blogName: b.blogName,
                createdAt: b.createdAt,
            }
        })
    },

    async getPostId(id: string):Promise<postOutput | null | boolean> {
        
        let post =  await postsCollections.findOne({_id: new ObjectId(id)});
        if (!post) {
            return false
        } else {
        return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            }
        }
        },

    async deletePostId(id: string):Promise<boolean> {
        let postId = await postsCollections.findOne({_id: new ObjectId(id)})
        
        if (postId) {
            try {
            await postsCollections.deleteOne(postId)
            return true}
            catch (e) {return false}
        } else {return false}       
        },

    async createdPostId(title: string, shortDescription: string, content: string, blogId: string): Promise<postOutput> {

        const blog = await blogsRepository.getBlogId(blogId);
        const createdAt = new Date().toISOString();

        const newPost: post = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: createdAt
            };
        const res = await postsCollections.insertOne({...newPost});
        return {
            id: res.insertedId.toString(),
            ...newPost
        }
    },

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const post = await postsCollections.updateOne({_id: new ObjectId(id)}, {$set: {title , shortDescription, content, blogId}})    
        if (post.matchedCount) {
            return true}
            else {
            return false} 
    },

    async deletePostAll(): Promise<boolean> {
        const deletResult = await postsCollections.find({}).toArray();
        if (deletResult) {
            try {await postsCollections.deleteMany({})
            return true}
            catch (e) {return false}}
            else 
            {return false}
    }
}
