import { blogInput } from '../../src/types/types-blogs';
import { app } from './../../src/index';
import  request  from "supertest";

export const createBlog = async ( saLogin: string, saPwd: string, model: blogInput,) => {
    return request(app).post('/blogs').auth(saLogin, saPwd).send(model)
}