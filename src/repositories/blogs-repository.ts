import { newBlogType } from "../type";

const blogs = [
    {
    id: 1,
    name: "name1",
    description: "description",
    websiteUrl: "websiteUrl"
    },
    {
    id: 2,
    name: "name2",
    description: "description",
    websiteUrl: "websiteUrl"
    }
  ];

export const blogsRepository = {
    
    findBlogs() {
        return blogs;
    },
    getBlogId(id: number) {
        let blog = blogs.find(p => p.id === id )
        return blog;    
    },

    createBlog(name: string, description: string, websiteUrl:string ) {
        
    /*let apiErrorResult =[];
    if (!name || typeof name !== 'string' || name.length > 15) {
      apiErrorResult.push({message: 'string length >15', field: "name"})
    }
    
    if (!description || typeof description !== 'string' || description.length > 500) {
      apiErrorResult.push({message: 'string length >500', field: "description"})
    }

    if (!websiteUrl || typeof websiteUrl !== 'string' || websiteUrl.length > 100) {
      apiErrorResult.push({message: 'string length >100', field: "websiteUrl"})
    }
    
    if (reg.test(websiteUrl) == false) {
      apiErrorResult.push({message: 'string', field: "pattern"})
    }
    
        
    if (apiErrorResult.length !== 0) {
        return({ errorsMessages: apiErrorResult});
    } else {
  */
    const newBlog : newBlogType = {
      id: +(new Date()),
      name: name,
      description: description,
      websiteUrl: websiteUrl
    }
    blogs.push(newBlog)
    return newBlog;
    },
    
    updateBlog(name: string, description: string, websiteUrl: string, id: number) {
    let apiErrorResult = [];
    let blog = blogs.find(p => p.id === id);
    
    if (!blog) {
      return false
    } else {
/*
    if (!name || typeof name !== 'string' || name.length > 15) {
      apiErrorResult.push({message: 'string length >15', field: "name"})
    }
    
    if (!description || typeof description !== 'string' || description.length > 500) {
      apiErrorResult.push({message: 'string descriptionBlog length >500', field: "descriptionBlog"})
    }
  
    if (!websiteUrl || typeof websiteUrl !== 'string' || websiteUrl.length > 100) {
      apiErrorResult.push({message: 'string websiteUrlBlog length >500', field: "websiteUrlBlog"})
    }
    
    if (apiErrorResult.length !== 0) {
      return({ errorsMessages: apiErrorResult});
    } else {
        */
        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;
        return true;
    }
    },

    deleteBlogId(id: number) {
      for (let i=0; i<blogs.length; i++) {
        if (blogs[i].id === id) {
          blogs.splice(i, 1);
          return true;
        }
      }
      return false
    }


  }
