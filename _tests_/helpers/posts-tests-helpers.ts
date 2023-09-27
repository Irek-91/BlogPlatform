import  request  from "supertest";
import { app } from "../../src";
import { postInput } from "../../src/types/types-posts";



export const createPost = async ( saLogin: string, saPwd: string, model: postInput,) => {
    
    return request(app).post('/posts').auth(saLogin, saPwd).send(model)
}