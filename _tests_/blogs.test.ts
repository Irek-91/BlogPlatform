
import { app } from './../src/index';
import request from 'supertest'
import { createBlog } from './helpers/blogs-tests-helpers';
import { blogInput,  } from '../src/types/types-db';


describe ('tests for blogs', () => {
     
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
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

            // const modelTwo: blogInput = {
            //     name: 'ran()',
            //     description: 'description',
            //     websiteUrl: 'websiteUrl',
            // }
            // const thirdRes = await createBlog('admin', 'qwerty', modelTwo)
            // expect(thirdRes.status).toBe(400)
            // expect(firstRes.body).toEqual(errors)

            const modelThree: blogInput = {
                name: 'name',
                description: 'description',
                websiteUrl: 'https://samurai.it-incubator.com',
            }
            const fourthRes = await createBlog('admin', 'qwerty', modelThree)
            expect(fourthRes.status).not.toBe(400)
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

        it('should return 200 status code and crated blog', async () => {
            const {blog} = expect.getState()

            const res = await request(app).get(`/blogs/${blog.id}`)
            expect(res.status).toBe(200)
            expect(res.body).toEqual(blog)
        })
    })  
})
