import { createUser } from './helpers/users-tests-helpers';
import request from 'supertest'
import { MongoClient } from 'mongodb';
import { createBlog } from './helpers/blogs-tests-helpers';
import { createPost } from './helpers/posts-tests-helpers';
import { log } from 'console';
import { app } from '../src';
import { userInputModel } from '../src/types/user';



describe('create user in the system ', () => {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })

        it ('return user ', async () => {
            const creatResponse = await request(app)
                .get('/users')
                .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                .expect(200)
            const getPosts = creatResponse.body
            expect(getPosts).toEqual({pagesCount: 0,
                                  page: 1,
                                  pageSize: 10,
                                  totalCount: 0,
                                  items: []
                                 })

        })

        it ('error 404 is returned, there is no such user', async () => {
            await request(app)
                    .get('/users/:5')
                    .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                    .expect(404)
        })
        
        it('should return 401 status code', async () => {
            const model: userInputModel = {
                login: 'panda',
                password: 'panda2023',
                email: 'panda@mail.com',
            }
            const firstRes = await createUser('', '', model)
            expect(firstRes.status).toBe(401)

            const secondRes = await createUser('any', 'any', model)
            expect(secondRes.status).toBe(401)

            const thirdRes = await createUser('admin', 'qwerty', model)
            const getUser = thirdRes.body

            expect(thirdRes.status).not.toBe(401)
            
            expect.setState({user: getUser})
        })

        it('should return 400 status code with errors', async () => {
            const errorsUsers = {
                errorsMessages: expect.arrayContaining([
                    {
                        field: 'login',
                        message: expect.any(String)
                    },
                    {
                        field: 'password',
                        message: expect.any(String)
                    },
                    {
                        field: 'email',
                        message: expect.any(String)
                    }
                ])
            }
            const modelOne: userInputModel = {
                login: '',
                password: '',
                email: '',
            }
            const firstRes = await createUser('admin', 'qwerty', modelOne)
            expect(firstRes.status).toBe(400)
            expect(firstRes.body).toEqual(errorsUsers)
            
            const modelTwo: userInputModel = {
                login: '12',
                password: '123456',
                email: 'sdvsdv@mail.ru',
            }
            const errorsUsersTwo = {
                errorsMessages: expect.arrayContaining([
                    {
                        field: 'login',
                        message: expect.any(String)
                    }
                ])
            }
            const twoRes = await createUser('admin', 'qwerty', modelTwo)
            expect(twoRes.status).toBe(400)
            expect(twoRes.body).toEqual(errorsUsersTwo)

            const modelFree: userInputModel = {
                login: '123456',
                password: '123456',
                email: 'sdvsdvmail.ru',
            }
            const errorsUsersFree = {
                errorsMessages: expect.arrayContaining([
                    {
                        field: 'email',
                        message: expect.any(String)
                    }
                ])
            }
            const freeRes = await createUser('admin', 'qwerty', modelFree)
            expect(freeRes.status).toBe(400)
            expect(freeRes.body).toEqual(errorsUsersFree)


        })


        it ('should return 200 status code and created user', async () => {
            const {user} = expect.getState()
            const res = await request(app).get(`/users`)
                                          .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})

            expect(res.status).toBe(200)
            expect(res.body).toEqual({pagesCount: expect.any(Number),
                                      page: expect.any(Number),
                                      pageSize: expect.any(Number),
                                      totalCount: expect.any(Number),
                                      items: [user]
               })
        })
        
        it ('delete userId ', async () => {
        const {user} = expect.getState()

        const res = await request(app).delete(`/users/${user.id}`)
                                      .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        expect(res.status).toBe(204)
        const resTwo = await request(app).get(`/users`)
                                          .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
        expect(resTwo.status).toBe(200)
        expect(resTwo.body).toEqual({pagesCount: expect.any(Number),
            page: expect.any(Number),
            pageSize: expect.any(Number),
            totalCount: expect.any(Number),
            items: []
        })                   
    })
})