import { newBlogType } from "../type";
import { blogsCollections } from "../db/db-mongo";



export const blogsRepository = {
    
    async findBlogs() {
      return blogsCollections.find({}).toArray()
    },

    async getBlogId(id: string) {
        let blog = await blogsCollections.findOne({id: id})
        return blog;    
    },

    async createBlog(name: string, description: string, websiteUrl:string ) {
        
    const newBlog : newBlogType = {
      id: String(+new Date()),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date ().toISOString(),
      isMembership: false
    }
    await blogsCollections.insertOne(newBlog)
    return newBlog;
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) {
    const blogResult = await blogsCollections.updateOne({id: id}, {
      $set : {name: name, description: description, websiteUrl: websiteUrl}
      });
      if (!blogResult) 
      {return false}
       else {
      return true}
    },

    async deleteBlogId(id: string) {
      const deletResult = await blogsCollections.deleteOne({id: id})
      return deletResult.deletedCount === 1
      
    },
    
    async deleteBlogAll() {
      const deletResult = await blogsCollections.deleteMany({})
      return true
    }
  }

