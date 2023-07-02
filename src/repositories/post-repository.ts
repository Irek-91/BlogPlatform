import { postType } from "../type";

const posts = [
    {
      id: 1,
      title: "post1",
      shortDescription: "string",
      content: "string",
      blogId: "string",
      blogName: "string"
  },
  {
    id: 2,
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

    getPostId(id: number) {
        let post = posts.find(p => p.id === id)
        return post;
    },

    deletePostId(id: number) {
        for (let i=0; i<posts.length; i++) {
            if (posts[i].id === id) {
              posts.splice(i, 1);
              return true
            }
        }
        return false
    },

    createdPostId(title: string, shortDescription: string, content: string, blogId: string) {
        const newPost: postType = {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: "string"
            };
        posts.push(newPost);
        return newPost;
    },
    updatePostId(id: number, title: string, shortDescription: string, content: string, blogId: string) {
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
    }
}