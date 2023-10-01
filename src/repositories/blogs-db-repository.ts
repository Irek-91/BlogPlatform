import { blogMongoDB } from './../types/types-blogs';
import { ObjectId } from "mongodb";
import { paginatorBlog } from '../types/types_paginator';
import { QueryPaginationType } from '../midlewares/pagination';
import { BlogsModelClass } from '../db/db-mongoos';
import { blogOutput } from "../types/types-blogs";
import { log } from 'console';



export class BlogsRepository  {

  async findBlogs(pagination: QueryPaginationType): Promise<paginatorBlog> {
    const blogs = await BlogsModelClass.
      find({ name: { $regex: pagination.searchNameTerm, $options: 'i' } }).
      sort([[pagination.sortBy, pagination.sortDirection]]).
      skip(pagination.skip).
      limit(pagination.pageSize).
      lean()
    const totalCount = await BlogsModelClass.countDocuments({ name: { $regex: pagination.searchNameTerm, $options: 'i' } })
    const blogsOutput: blogOutput[] = blogs.map((b) => {
      return {
        id: b._id.toString(),
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        isMembership: b.isMembership,
      }
    })

    return {
      pagesCount: Math.ceil(totalCount / pagination.pageSize),
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: blogsOutput
    }
  }


  async getBlogId(id: string): Promise<blogOutput | false> {
    try {
      const blog = await BlogsModelClass.findOne({ _id: new ObjectId(id) }).lean()
      if (!blog) return false
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: false,
      }
    }
    catch (e) {
      return false
    }
  }
  async getBlogNameById(id: string): Promise<string | false> {
    try {
      const blog = await BlogsModelClass.findOne({ _id: new ObjectId(id) }).lean()
      if (!blog) return false
      return blog.name
    }
    catch (e) {
      return false
    }
  }



  async createBlog(newBlog: blogMongoDB) {
    return BlogsModelClass.insertMany({ ...newBlog })

  }

  async updateBlog(name: string, description: string, websiteUrl: string, id: string): Promise<boolean> {
    try {
      // const query = BlogsModelClass.where({_id: new ObjectId(id)})
      const blogsInstance = await BlogsModelClass.findOne({ _id: new ObjectId(id) })
      if (!blogsInstance) {
        return false
      }
      else {
        blogsInstance.name = name
        blogsInstance.description = description
        blogsInstance.websiteUrl = websiteUrl

        await blogsInstance.save()
        return true
      }
    }
    catch (e) {

      return false
    }
  }

  async deleteBlogId(id: string): Promise<boolean> {
    try {
      const blogsInstance = await BlogsModelClass.findOne({ _id: new ObjectId(id) })
      if (!blogsInstance) return false
      await blogsInstance.deleteOne()
      return true
    }
    catch (e) { return false }

  }

  async deleteBlogAll(): Promise<boolean> {
    try {
      const blogsInstance = await BlogsModelClass.deleteMany({})
      if (!blogsInstance) return false
      return true
    }
    catch (e) { return false }
  }
}