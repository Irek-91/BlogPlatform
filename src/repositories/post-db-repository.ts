import { postType } from "../type";
import { blogsRepository } from "./blogs-db-repository";
//import { posts } from "../db/db";
import { postsCollections } from "../db/db-mongo";


export const postRepository = {
    async findPost() {
        return postsCollections.find({}, {projection:{_id: 0}}).toArray();
    },

    async getPostId(id: string) {
        
        let post = await postsCollections.findOne({id:id}, {projection:{_id: 0}})
        return post;
    },

    async deletePostId(id: string) {
        let postId = await postsCollections.deleteOne({id:id})
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
        await postsCollections.insertOne(newPost)
        return newPost;
    },

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const post = await postsCollections.findOne({id:id}, {projection:{_id: 0}})
            
        if (post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.blogId = blogId;
            return true;
        } else {
            return false;
        }
    },

    async deletePostAll() {
        const deletResult = await postsCollections.deleteMany({})
        return true;
    }
}