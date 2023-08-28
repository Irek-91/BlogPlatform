import { postInput, postInputModel } from './../src/types/types-db';
import { app } from '../src/index';
import request from 'supertest'
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error ('URL doesn\'t found')
}
const client = new MongoClient(mongoUri)

describe ('tests for posts', () => {
     
    beforeAll(async () => {
    await client.connect()
 
        await request(app).delete('/testing/all-data')
    })

   afterAll(async () => {
        await client.close()
     })

    it ('return posts ', async () => {
        const creatResponse = await request(app)
            .get('/posts')
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
                .get('/posts/:5')
                .expect(404)
    })
    
    /* it ('создаем пост', async () => {
        const data: postInputModel = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string"
        }
        const creatResponse = await request(app)

                .post('/posts')
                .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                .send(data)
                .expect(201)
        const getPosts = creatResponse.body

        expect(getPosts).toEqual({
            id: expect.any(String),
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: expect.any(String),
            blogName: "string"
          }) */



    } )

