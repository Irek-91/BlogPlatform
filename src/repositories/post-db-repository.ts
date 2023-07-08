import { postType } from "../type";
import { blogsRepository } from "./blogs-db-repository";
//import { posts } from "../db/db";
import { client } from "../db/db-mongo";

const dbCollections = client.db('BlogPlatform').collection('posts');


export const postRepository = {
    async findPost() {
        return dbCollections.find({}).toArray();
    },

    async getPostId(id: string) {
        
        let post = dbCollections.findOne({id:id})
        return post;
    },

    async deletePostId(id: string) {
        let postId = await dbCollections.deleteOne({id:id})
        return postId.deletedCount === 1
        
    },

    async createdPostId(title: string, shortDescription: string, content: string, blogId: string): Promise<postType> {

        const blog = await blogsRepository.getBlogId(blogId);
        const createdAt = new Date().toISOString();

        const newPost: postType = {
            id: String(+(new Date())),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog!.name,
            createdAt: createdAt
            };
        await dbCollections.insertOne(newPost)
        return newPost;
    },

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const post = await dbCollections.updateOne({id:id}, {$set:
            {title:title,
            shortDescription:shortDescription,
            content:content,
            blogId:blogId}
        });
        if (post) {
            return true;
        } else {
            return false;
        }
    },

    async deletePostAll() {
        const deletResult = await dbCollections.deleteMany({})
        return true;
    }
}