import { postType } from "../type";
import { blogsRepository } from "./blogs-repository";

const posts = [
    {
      id: '1',
      title: "post1",
      shortDescription: "string",
      content: "string",
      blogId: "string",
      blogName: "string"
  },
  {
    id: '2',
    title: "post1",
    shortDescription: "string",
    content: "string",
    blogId: "string",
    blogName: "string"
  }
]

export const postRepository = {
    findPost() {
        return posts;
    },

    getPostId(id: string) {
        let post = posts.find(p => p.id === id)
        return post;
    },

    deletePostId(id: string) {
        for (let i=0; i<posts.length; i++) {
            if (posts[i].id === id) {
              posts.splice(i, 1);
              return true
            }
        }
        return false
    },

    createdPostId(title: string, shortDescription: string, content: string, blogId: string) {

        const blog = blogsRepository.getBlogId(blogId);

        const newPost: postType = {
            id: String(+(new Date())),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog!.name
            };
        posts.push(newPost);
        return newPost;
    },
    updatePostId(id: string, title: string, shortDescription: string, content: string, blogId: string) {
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
    deletePostAll() {
        posts.length = 0;
        return true;
      }
}