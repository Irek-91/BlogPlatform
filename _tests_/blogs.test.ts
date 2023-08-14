import { app } from './../src/index';
import request from 'supertest'


describe ('/blogs', () => {
     
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it ('return blogs', async () => {
        await request(app)
            .get('/blogs')
            .expect(200)
    })

    it ('shoul return 404, ', async () => {
        await request(app)
                .get('/blogs/:5')
                .expect(404)
    })
    
    it ('', async () => {
        await request(app)
                .post('/blogs')
                .send({
                    "name": "",
                    "description": "string",
                    "websiteUrl": "https://vc12.com"
                  })
                .expect(404)
    })
})