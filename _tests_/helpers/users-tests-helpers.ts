import { app } from '../../src/app';
import  request  from "supertest";
import { userInputModel, userViewModel } from '../../src/types/user';


export const createUser = async ( saLogin: string, saPwd: string, model: userInputModel): Promise<{ response: request.Response;
    createdUser: userViewModel;}> => {
    const response = await request(app).post('/users').auth(saLogin, saPwd).send(model)
    const createdUser = response.body
    return { response, createdUser }
}
