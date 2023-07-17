import { blogInput, blogMongoDB,  } from './../types/types-db';
import { blogType } from "../types/types";
import { blogsCollections } from "../db/db-mongo";
import { ObjectId } from "mongodb";
import { blogOutput } from "../types/types-db";
import { paginatorBlog } from '../types/types_paginator';


export const blogsRepository = {
    
    async findBlogs(searchNameTerm: string, sortBy:string, sortDirection:any, pageNumber:number, pageSize:number): Promise<paginatorBlog> {
      const skipPosts = (pageNumber -1)*pageSize;
      const blogs = await blogsCollections.find({ name: { $regex: searchNameTerm, $options: 'i' }}).sort(sortBy,sortDirection).skip(skipPosts).limit(pageSize).toArray();
      const totalCount = await blogsCollections.countDocuments({ name: { $regex: searchNameTerm, $options: 'i' }})
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

    async getBlogId(id: string): Promise<blogType | boolean> {
        try {const blog = await blogsCollections.findOne({_id: new ObjectId(id)})
        if (blog != null) {
            return {
              id: blog._id.toString(),
              name: blog.name,
              description: blog.description,
              websiteUrl: blog.websiteUrl,
              createdAt: blog.createdAt,
              isMembership: false,
            }
        } else {return false}}
        catch (e) {return false}
    },

    async createBlog(newBlog: blogInput): Promise<blogOutput> {
      const res = await blogsCollections.insertOne({...newBlog})
        return {
        id: res.insertedId.toString(),
        ...newBlog
      }
    },
    
    async updateBlog(name: string, description: string, websiteUrl: string, id: string) : Promise<boolean> {
      try {const blog = await blogsCollections.updateOne({_id: new ObjectId(id)}, {$set: {name , description, websiteUrl}})
      return blog.matchedCount === 1}
      catch (e) {return false}
    },

    async deleteBlogId(id: string) : Promise<boolean> {
      try {const deletResult = await blogsCollections.deleteOne({_id: new ObjectId(id)})
      return deletResult.deletedCount === 1}
      catch (e) {return false}
      
    },
    
    async deleteBlogAll() : Promise<boolean> {
      const deletResult = await blogsCollections.deleteMany({})
      return true
    }
  }

