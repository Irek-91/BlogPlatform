import request from 'supertest'
import { createBlog } from './helpers/blogs-tests-helpers';
import { app } from '../src/app';
import { blogInput } from '../src/types/types-blogs';
import { connectDisconnectDb, runDbMongoose } from '../src/db/db-mongoos';
import { log } from 'console';

describe ('tests for blogs', () => {

    beforeAll(async () => {
        await runDbMongoose()
        await request(app).delete('/testing/all-data')

    })

    afterAll (async () => {
        await connectDisconnectDb()
    })
    

    describe('create blog tests', () => {
        
        it('should return 401 status code', async () => {
            const model: blogInput = {
                name: 'name',
                description: 'description',
                websiteUrl: 'websiteUrl',
            }
            const firstRes = await createBlog('', '', model)
            expect(firstRes.status).toBe(401)

            const secondRes = await createBlog('any', 'any', model)
            expect(secondRes.status).toBe(401)

            const thirdRes = await createBlog('admin', 'qwerty', model)
            expect(thirdRes.status).not.toBe(401)
        })

        it('should return 400 status code with errors', async () => {
            const errors = {
                errorsMessages: expect.arrayContaining([
                    {
                        field: 'name',
                        message: expect.any(String)
                    },
                    {
                        field: 'description',
                        message: expect.any(String)
                    },
                    {
                        field: 'websiteUrl',
                        message: expect.any(String)
                    }
                ])
            }
            const firstRes = await createBlog('admin', 'qwerty', {} as blogInput)
            expect(firstRes.status).toBe(400)
            expect(firstRes.body).toEqual(errors)

            const modelOne: blogInput = {
                name: '',
                description: '',
                websiteUrl: '',
            }

            const secondRes = await createBlog('admin', 'qwerty', modelOne)
            expect(secondRes.status).toBe(400)
            expect(secondRes.body).toEqual(errors)

            // const modelThree: blogInput = {
            //     name: 'name3',
            //     description: 'description',
            //     websiteUrl: 'https://samurai.it-incubator.com',
            // }
            // const fourthRes = await createBlog('admin', 'qwerty', modelThree)
            // expect(fourthRes.status).not.toBe(400)

            
        })

        it('should return 201 status code and created blog', async () => {
            const model: blogInput = {
                name: 'name',
                description: 'description',
                websiteUrl: 'https://samurai.it-incubator.com',
            }
            const res = await createBlog('admin', 'qwerty', model)

            expect(res.status).toBe(201)
            expect(res.body ).toEqual({
                id: expect.any(String),
                name: model.name,
                description: model.description,
                websiteUrl: model.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false
            })

            expect.setState({blog: res.body})
        })

        it('should return 200 status code and created blog', async () => {
            const {blog} = expect.getState()
            const res = await request(app).get(`/blogs/${blog.id}`)
            expect(res.status).toBe(200)
            expect(res.body).toEqual(blog)
        })

        
        it('обновление блога',async () => {
            const {blog} = expect.getState()
            const data: blogInput = {
                name: "UpdateBlog",
                description: "string",
                websiteUrl: 'https://samurai.it-incubator.com',
            }
            const res = await request(app).put(`/blogs/${blog.id}`)
                                          .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                                          .send(data)
                                          .expect(204)
            const result = await request(app).get(`/blogs/${blog.id}`)
            expect(result.body).toEqual({
                id: blog.id,
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false})
            })

            it('удаление блога',async () => {
                const {blog} = expect.getState()
                const res = await request(app).delete(`/blogs/${blog.id}`)
                                              .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                                              .expect(204)
                const result = await request(app).get(`/blogs`)

                expect(result.status).toBe(200)
                expect(result.body).toEqual(({pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                   }))
            })

    })

})