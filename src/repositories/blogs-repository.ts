import { stringify } from "querystring";
import { newBlogType } from "../type";

const blogs = [
    {
    id: "1",
    name: "name1",
    description: "description",
    websiteUrl: "websiteUrl"
    },
    {
    id: "2",
    name: "name2",
    description: "description",
    websiteUrl: "websiteUrl"
    }
  ];

export const blogsRepository = {
    
    findBlogs() {
        return blogs;
    },
    getBlogId(id: string) {
        let blog = blogs.find(p => p.id === id )
        return blog;    
    },

    createBlog(name: string, description: string, websiteUrl:string ) {
        
    const newBlog : newBlogType = {
      id: String(+new Date()),
      name: name,
      description: description,
      websiteUrl: websiteUrl
    }
    blogs.push(newBlog)
    return newBlog;
    },
    
    updateBlog(name: string, description: string, websiteUrl: string, id: string) {
    let apiErrorResult = [];
    let blog = blogs.find(p => p.id === id);
    
    if (!blog) {
      return false
    } else {
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        return true;
    }
    },

    deleteBlogId(id: string) {
      for (let i=0; i<blogs.length; i++) {
        if (blogs[i].id === id) {
          blogs.splice(i, 1);
          return true;
        }
      }
      return false
    },
    
    deleteBlogAll() {
      blogs.length = 0
      return true;
    }
  }
