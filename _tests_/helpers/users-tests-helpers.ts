import { app } from '../../src/index';
import  request  from "supertest";
import { userInputModel } from '../../src/types/user';

export const createUser = async ( saLogin: string, saPwd: string, model: userInputModel) => {
    return request(app).post('/users').auth(saLogin, saPwd).send(model)
}