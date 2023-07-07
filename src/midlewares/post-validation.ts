import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { blogsRepository } from "../repositories/blogs-repository";


export const titleValidation = body('title').trim().notEmpty().isString().isLength({max: 30}).withMessage('error in string length');
export const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isLength({max: 100}).withMessage('error in shortDescription length');
export const contentValidation = body('content').trim().notEmpty().isString().isLength({max: 1000}).withMessage("error in content length");
export const blogIdValidation = body('blogId').trim().notEmpty().isString().withMessage("error in the content").custom((blogId) => {

  const blog = blogsRepository.getBlogId(blogId);

  if(!blog){
    throw new Error("Blog with this BlogId not found")
  }

  return true
});