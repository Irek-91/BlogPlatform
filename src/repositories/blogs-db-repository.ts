import { blogInput, blogMongoDB,  } from './../types/types-db';
import { blogType } from "../types/types";
import { blogsCollections } from "../db/db-mongo";
import { ObjectId } from "mongodb";
import { blogOutput } from "../types/types-db";
import { paginatorBlog } from '../types/types_paginator';


export const blogsRepository = {
    
    async findBlogs(searchNameTerm: string, sortBy:string, sortDirection:any, pageNumber:number, pageSize:number): Promise<paginatorBlog> {
      const skipPosts = (pageNumber -1)*pageSize;
      const blogs = await blogsCollections.find({$text:{$search: searchNameTerm}}).sort(sortBy,sortDirection).skip(skipPosts).limit(pageSize).toArray();
      const totalCount = await blogsCollections.count()
      const blogsOutput =  blogs.map((b) => {
        return {
          id: b._id.toString(),
          name: b.name,
          description: b.description,
          websiteUrl: b.websiteUrl,
          createdAt: b.createdAt,
          isMembership: false,
        }
      })
      return {
        pagesCount: blogsOutput.length,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: blogsOutput
      }
    },

    async getBlogId(id: string): Promise<blogType | null> {
        const blog = await blogsCollections.findOne({_id: new ObjectId(id)})
        if (blog) {
            return {
              id: blog._id.toString(),
              name: blog.name,
              description: blog.description,
              websiteUrl: blog.websiteUrl,
              createdAt: blog.createdAt,
              isMembership: false,
            }
        } else {return null}
    },

    async createBlog(newBlog: blogInput): Promise<blogOutput> {
      const res = await blogsCollections.insertOne({...newBlog})
        return {
        id: res.insertedId.toString(),
        ...newBlog
      }
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) : Promise<boolean> {
      const blog = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: {name , description, websiteUrl}})
      return blog.matchedCount ===1
    },

    async deleteBlogId(id: string) : Promise<boolean> {
      const deletResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
      return deletResult.deletedCount === 1
      
    },
    
    async deleteBlogAll() : Promise<boolean> {
      const deletResult = await blogsCollections.deleteMany({})
      return true
    }
  }

