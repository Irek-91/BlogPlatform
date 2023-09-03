import { blogType } from "../types/types";
import { blogInput, blogMongoDB, blogOutput, blogsCollectionsType } from "../types/types-db";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { QueryPaginationType } from '../midlewares/pagination';
import { ObjectId } from "mongodb";



export const blogsService = {  
    async findBlogs(paginationQuery : QueryPaginationType) {
      return await blogsRepository.findBlogs(paginationQuery)
    },

    async getBlogId(id: string): Promise<blogOutput | boolean>  {
        return await blogsRepository.getBlogId(id)
    },

    async createBlog(name: string, description: string, websiteUrl:string ): Promise<blogOutput> {
        const newBlog : blogMongoDB = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date ().toISOString(),
            isMembership: false
        }
        await blogsRepository.createBlog(newBlog)
        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl:newBlog. websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) : Promise<boolean> {
        return await blogsRepository.updateBlog(name, description, websiteUrl, id)
    },

    async deleteBlogId(id: string) : Promise<boolean> {
        return await blogsRepository.deleteBlogId(id)
    },
    
    async deleteBlogAll() : Promise<boolean> {
      return await blogsRepository.deleteBlogAll()
    }
  }
