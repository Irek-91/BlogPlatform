import { BlogsRepository } from './../repositories/blogs-db-repository';
import { QueryPaginationType } from '../midlewares/pagination';
import { ObjectId } from "mongodb";
import { BlogsModelClass } from "../db/db-mongoos";
import { BlogMongoDB, blogOutput } from "../types/types-blogs";



export class BlogsService {
    private blogsRepository: BlogsRepository

    constructor () {
        this.blogsRepository = new BlogsRepository()
    }
    
    async findBlogs(paginationQuery: QueryPaginationType) {
        return await this.blogsRepository.findBlogs(paginationQuery)
    }

    async getBlogId(id: string): Promise<blogOutput | boolean> {
        return await this.blogsRepository.getBlogId(id)
    }

    async createBlog(name: string, description: string, websiteUrl: string): Promise<blogOutput> {
        const newBlog = new BlogMongoDB(new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false)
        const newBlogInstance = new BlogsModelClass(newBlog)


        await this.blogsRepository.createBlog(newBlog)
        return {
            id: newBlog._id.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    }

    async updateBlog(name: string, description: string, websiteUrl: string, id: string): Promise<boolean> {
        return await this.blogsRepository.updateBlog(name, description, websiteUrl, id)
    }

    async deleteBlogId(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogId(id)
    }

    async deleteBlogAll(): Promise<boolean> {
        return await this.blogsRepository.deleteBlogAll()
    }
}
