import  request  from "supertest";
import { app } from "../../src/app";
import { postInput } from "../../src/types/types-posts";



export const createPost = async ( saLogin: string, saPwd: string, model: postInput,) => {
    
    const result = await request(app).post('/posts').auth(saLogin, saPwd).send(model)
    return result
}

