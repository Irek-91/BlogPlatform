import { app } from '../../src/index';
import  request  from "supertest";
import { loginInputModel, userInputModel } from '../../src/types/user';

export const createdAccessToken = async (model: loginInputModel) => {
    return await request(app).post('/auth/login').send(model)
}