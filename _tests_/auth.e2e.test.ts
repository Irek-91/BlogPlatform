import request from 'supertest'
import { app } from '../src';
import { userInputModel } from '../src/types/user';
import { createUser } from './helpers/users-tests-helpers';
import { createdAccessToken } from './helpers/auth-tests-helpers';
import { jwtService } from '../src/application/jwt-service';


describe ('tests for auth', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    describe('Try login user to the system ', () => {

        it(  'returns JWT accessToken', async () => {
            const modelUserOne: userInputModel = {
                login: 'nikita',
                password: 'nikita2023',
                email: 'nikita@mail.com',
                }
            const userOne = await createUser('admin', 'qwerty', modelUserOne)
            const authUserOne = {
                loginOrEmail: modelUserOne.login,
                password: modelUserOne.password,
            }
            const accessToken = await createdAccessToken(authUserOne)
            expect(accessToken.status).toBe(200)
        })
    })
})