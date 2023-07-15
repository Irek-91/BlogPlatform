import { stringify } from "querystring";
import { blogType } from "../types/types";
import { blogs } from "../db/db";

export const blogsRepository = {
    
    async findBlogs() {
        return blogs;
    },

    async getBlogId(id: string) {
        let blog = blogs.find(p => p.id === id )
        return blog;    
    },

    async createBlog(name: string, description: string, websiteUrl:string ) {
        
    const newBlog : blogType= {
      id: String(+new Date()),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date ().toISOString(),
      isMembership: false
    }
    blogs.push(newBlog)
    return newBlog;
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) {
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

    async deleteBlogId(id: string) {
      for (let i=0; i<blogs.length; i++) {
        if (blogs[i].id === id) {
          blogs.splice(i, 1);
          return true;
        }
      }
      return false
    },
    
    async deleteBlogAll() {
      blogs.length = 0
      return true;
    }
  }

