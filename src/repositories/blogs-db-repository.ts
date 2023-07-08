import { newBlogType } from "../type";
import { client } from "../db/db-mongo";

const dbCollections = client.db('BlogPlatform').collection('blogs');

export const blogsRepository = {
    
    async findBlogs() {
      return dbCollections.find({}).toArray()
    },

    async getBlogId(id: string) {
        let blog = await dbCollections.findOne({id: id})
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
    await dbCollections.insertOne(newBlog)
    return newBlog;
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) {
    const blogResult = await dbCollections.updateOne({id: id}, {
      $set : {name: name, description: description, websiteUrl: websiteUrl}
      });
      if (!blogResult) 
      {return false}
       else {
      return true}
    },

    async deleteBlogId(id: string) {
      const deletResult = await dbCollections.deleteOne({id: id})
      return deletResult.deletedCount === 1
      
    },
    
    async deleteBlogAll() {
      const deletResult = await dbCollections.deleteMany({})
      return true
    }
  }

