"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
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
exports.blogsRepository = {
    findBlogs() {
        return blogs;
    },
    getBlogId(id) {
        let blog = blogs.find(p => p.id === id);
        return blog;
    },
    createBlog(name, description, websiteUrl) {
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
        const newBlog = {
            id: +(new Date()),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(name, description, websiteUrl, id) {
        let apiErrorResult = [];
        let blog = blogs.find(p => p.id === id);
        if (!blog) {
            return false;
        }
        else {
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
    deleteBlogId(id) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    deleteBlogAll() {
        blogs.splice(-1, 0);
        return true;
    }
};
