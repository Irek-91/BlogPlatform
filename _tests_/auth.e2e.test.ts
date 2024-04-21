// @ts-ignore
import request from 'supertest'
import { app } from '../src/app';
import { userInputModel } from '../src/types/user';
import { createUser } from './helpers/users-tests-helpers';
import { createdAccessToken } from './helpers/auth-tests-helpers';
import { jwtService } from '../src/application/jwt-service';
import { connectDisconnectDb, runDbMongoose } from '../src/db/db-mongoos';

describe ('tests for auth', () => {

    beforeAll(async () => {
        await runDbMongoose()
        await request(app).delete('/testing/all-data')

    })

    afterAll (async () => {
        await connectDisconnectDb()
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
            const accessTokenOne = await createdAccessToken(authUserOne)
            expect(accessTokenOne.status).toBe(200)
            expect(accessTokenOne.body).toEqual({
                accessToken: expect.any(String)
            })
        })
    })
})