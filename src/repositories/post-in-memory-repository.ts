import { postType } from "../type";
import { blogsRepository } from "./blogs-in-memory-repository";
import { posts } from "../db/db";


export const postRepository = {
    async findPost() {
        return posts;
    },

    async getPostId(id: string) {
        let post = posts.find(p => p.id === id)
        return post;
    },

    async deletePostId(id: string) {
        for (let i=0; i<posts.length; i++) {
            if (posts[i].id === id) {
              posts.splice(i, 1);
              return true
            }
        }
        return false
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
        posts.push(newPost);
        return newPost;
    },

    async updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        let post = posts.find(p => p.id === id);
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
        posts.length = 0;
        return true;
      }
}