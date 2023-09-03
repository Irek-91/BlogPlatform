import  request  from "supertest";
import { blogInput } from "../../src/types/types-db";
import { app } from "../../src";



export const createBlog = async ( saLogin: string, saPwd: string, model: blogInput,) => {
    return request(app).post('/blogs').auth(saLogin, saPwd).send(model)
}