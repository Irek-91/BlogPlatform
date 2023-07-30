import { paginatorBlog } from './../types/types_paginator';
import { blogType } from "../types/types";
import { blogInput, blogOutput, blogsCollectionsType } from "../types/types-db";
import { blogsRepository } from "../repositories/blogs-db-repository";
import { QueryPaginationType } from '../midlewares/pagination';



export const blogsService = {  
    async findBlogs(paginationQuery : QueryPaginationType) {
      return await blogsRepository.findBlogs(paginationQuery)
    },

    async getBlogId(id: string): Promise<blogOutput | boolean>  {
        return await blogsRepository.getBlogId(id)
    },

    async createBlog(name: string, description: string, websiteUrl:string ): Promise<blogType> {
        const newBlog : blogInput = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date ().toISOString(),
            isMembership: false
        }
        return await blogsRepository.createBlog(newBlog)
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
