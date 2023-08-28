import { app } from './../src/index';
import request from 'supertest'


describe ('tests for blogs', () => {
     
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it ('return blogs ', async () => {
        const creatResponse = await request(app)
            .get('/blogs')
            .expect(200)
        const getBlogs = creatResponse.body
        expect(getBlogs).toEqual({pagesCount: 0,
                                  page: 1,
                                  pageSize: 10,
                                  totalCount: 0,
                                  items: []
                                 })

    })

    it ('error 404 is returned, there is no such user', async () => {
        await request(app)
                .get('/blogs/:5')
                .expect(404)
    })
    
    it (`should'nt create blogs witch incorrect input data `, async () => {
        await request(app)
                .post('/blogs')
                .send({
                    name: "new blog",
                    description: "string",
                    websiteUrl: "https://vc12.com"
                  })
                .expect(401)

        const creatResponse = await request(app)
                .get('/blogs')
                .expect(200)

        const getBlogs = creatResponse.body
        expect(getBlogs).toEqual({pagesCount: 0,
                                page: 1,
                                pageSize: 10,
                                totalCount: 0,
                                items: []
                                })
    })


    afterAll(async() => {
    })  
})
