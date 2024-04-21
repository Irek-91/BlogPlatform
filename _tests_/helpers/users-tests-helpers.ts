import { ObjectId } from 'mongodb';
import { app } from '../../src/app';
// @ts-ignore
import  request  from "supertest";
import { userInputModel, userViewModel } from '../../src/types/user';
import { jwtService } from '../../src/application/jwt-service';


type headers = {
    Authorization: string
}

export const createUser = async ( saLogin: string, saPwd: string, model: userInputModel): Promise<{ response: request.Response;
    user: userViewModel, headers: headers}> => {
    const response = await request(app).post('/users').auth(saLogin, saPwd).send(model)
    const user = response.body
    const AccessToken = await jwtService.createdJWTAccessToken(new ObjectId(user.id))
    const headers = {Authorization: `Bearer ${AccessToken}`}
    return { response, user, headers}
}
