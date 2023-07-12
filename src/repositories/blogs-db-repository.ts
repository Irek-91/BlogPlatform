import { blogType, newBlogType } from "../types/type";
import { blogsCollections } from "../db/db-mongo";
import { ObjectId } from "mongodb";
import { blogOutput } from "../types/types-db";



export const blogsRepository = {
    
    async findBlogs() {
      const blogs =await blogsCollections.find({}).toArray()
      return blogs.map((b) => {
        return {
          id: b._id,
          name: b.name,
          description: b.description,
          websiteUrl: b.websiteUrl,
          createdAt: b.createdAt,
          isMembership: false,
        }
    })
    },

    async getBlogId(id: string) {
        let blog = await blogsCollections.findOne({_id: new ObjectId(id)})
        if (!blog) {
          return null
        } else {
          return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: false,
        
          }    
        }
    },

    async createBlog(name: string, description: string, websiteUrl:string ): Promise<blogType> {
        
    const newBlog : blogOutput = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date ().toISOString(),
      isMembership: false
    }

    const res = await blogsCollections.insertOne({...newBlog})
      return {
        id: res.insertedId.toString(),
        ...newBlog
      }
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) {
    const blog = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: {name , description, websiteUrl}})
      if (blog.matchedCount) {
      return true}
      else {return false}
    },

    async deleteBlogId(id: string) {
      const deletResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
      return deletResult.deletedCount === 1
      
    },
    
    async deleteBlogAll() {
      const deletResult = await blogsCollections.deleteMany({})
      return true
    }
  }

