import request from 'supertest'
import { MongoClient } from 'mongodb';
import { createBlog } from './helpers/blogs-tests-helpers';
import { createPost } from './helpers/posts-tests-helpers';
import { log } from 'console';
import { app } from '../src';
import { blogInput } from '../src/types/types-blogs';
import { postInput } from '../src/types/types-posts';

// const mongoUri = process.env.MONGO_URL;
// if (!mongoUri) {
//     throw new Error ('URL doesn\'t found')
// }
// const client = new MongoClient(mongoUri)

describe ('tests for posts', () => {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    describe('create post tests', () => {

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
    })
    describe('create post tests', () => {
    
        
        it ('создаем пост', async () => {
        
        const model: blogInput = {
            name: 'namePost',
            description: 'description',
            websiteUrl: 'https://samurai.it-incubator.com',
        }
        const res = await createBlog('admin', 'qwerty', model)
        expect.setState({blog: res.body})
        const {blog} = expect.getState()

        const data: postInput = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const creatResponse = await createPost('admin', 'qwerty', data)
        const getPosts = creatResponse.body
        expect(getPosts).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: getPosts.createdAt,
            extendedLikesInfo: { 
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: [{
                    addedAt: getPosts.createdAt,
                    userId: 'string',
                    login: 'string'
                }]
              }
          })
        
        expect.setState({post: getPosts})
    })

    
    it('should return 200 status code and created post', async () => {
        const {post} = expect.getState()
        const res = await request(app).get(`/posts/${post.id}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
            id: expect.any(String),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: post.createdAt,
            extendedLikesInfo: { 
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: expect.any(Array)
              }
            })
    })
    })
    describe('creating a comment for a post', () => {
        const {blog} = expect.getState()
        const {post} = expect.getState()
        

    })
})
