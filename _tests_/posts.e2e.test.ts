import { Result } from 'express-validator';
import request from 'supertest'
import { MongoClient, ObjectId } from 'mongodb';
import { createBlog } from './helpers/blogs-tests-helpers';
import { createPost, createPostSpecific } from './helpers/posts-tests-helpers';
import { log } from 'console';
import { app } from '../src/app';
import { blogInput } from '../src/types/types-blogs';
import { postInput, postInputModel, postInputModelSpecific } from '../src/types/types-posts';
import { connectDisconnectDb, runDbMongoose } from '../src/db/db-mongoos';
import { createUser } from './helpers/users-tests-helpers';
import { userInputModel } from '../src/types/user';
import { createComment } from './helpers/comment_created';
import { jwtService } from '../src/application/jwt-service';

// const mongoUri = process.env.MONGO_URL;
// if (!mongoUri) {
//     throw new Error ('URL doesn\'t found')
// }
// const client = new MongoClient(mongoUri)

describe ('tests for posts', () => {

    beforeAll(async () => {
        await runDbMongoose()
        await request(app).delete('/testing/all-data')

    })

    afterAll (async () => {
        await connectDisconnectDb()
    })
    describe('return post tests', () => {

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
            description: 'create post tests',
            websiteUrl: 'https://samurai.it-incubator.com',
        }
        const res = await createBlog('admin', 'qwerty', model)
        expect.setState({blog: res.body})
        const {blog} = expect.getState()

        const data: postInputModel = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: blog.id,
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
                newestLikes: []
              }
          })
        
        expect.setState({post: getPosts})
    })

    it ('создаем пост специальный', async () => {
       
      const {blog} = expect.getState()

      const data: postInputModelSpecific = {
          title: "string",
          shortDescription: "string",
          content: "string",
      }
      const creatResponse = await createPostSpecific('admin', 'qwerty', blog.id, data)
      const getPostsTwo = creatResponse.body
      expect(creatResponse.status).toBe(201)
      expect(getPostsTwo).toEqual({
          id: expect.any(String),
          title: data.title,
          shortDescription: data.shortDescription,
          content: data.content,
          blogId: blog.id,
          blogName: blog.name,
          createdAt: getPostsTwo.createdAt,
          extendedLikesInfo: { 
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
              newestLikes: []
            }
        })
      
      expect.setState({postSpecific: getPostsTwo})
  })

    
    it('should return 200 status code and created post', async () => {
        const {post} = expect.getState()
        const {blog} = expect.getState()

        const res = await request(app).get(`/posts/${post.id}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
            id: expect.any(String),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: post.createdAt,
            extendedLikesInfo: { 
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: expect.any(Array)
              }
            })
    })

    it('обновление поста', async () => {
        const {post} = expect.getState()
        const {blog} = expect.getState()

        const updatePostData: postInputModel = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: blog.id
          }
        const result = await request(app).put(`/posts/${post.id}`)
                                      .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
                                      .send(updatePostData)
                                      .expect(204)
        const updateResult = await request(app).get(`/posts/${post.id}`)

        expect(result.status).toBe(204)
        expect(updateResult.body).toEqual({
            id: expect.any(String),
            title: updatePostData.title,
            shortDescription: updatePostData.shortDescription,
            content: updatePostData.content,
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: post.createdAt,
            extendedLikesInfo: { 
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: expect.any(Array)
              }
            }
        )
    })

    it('создание коментария для поста', async () => {
        const {blog} = expect.getState()
        const {post} = expect.getState()
        const userModel: userInputModel = {
            login: 'panda',
            password: 'panda2023',
            email: 'panda@mail.com',
        }
        const user = await createUser('admin', 'qwerty', userModel)
        const userOne = user.createdUser
        expect.setState({userOne: userOne})
        const newCommentData = {
                content: "coments of post!!!!!!!!!!!!!!!"    
        }
    
        const createCommment = await createComment(post.id, newCommentData, 201, new ObjectId(userOne.id))
        const result = await request(app).get(`/posts/${post.id}/comments`)
        expect(result.status).toBe(200)
        expect(result.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: 1,
                items: [
                  {
                    id: expect.any(String),
                    content: newCommentData.content,
                    commentatorInfo: {
                      userId: userOne!.id,
                      userLogin: userOne!.login
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                      likesCount: 0,
                      dislikesCount: 0,
                      myStatus: "None"
                    }
                  }
                ]
            })
        const dataIncorect = {
            content: "comentlength min 20"    
        }

        const commentIncorect = await createComment(post.id, dataIncorect, 400, new ObjectId(userOne.id))
        expect(commentIncorect.response.status).toBe(400)
        expect(commentIncorect.response.body).toEqual(
                {
                    "errorsMessages": [
                      {
                        "message": expect.any(String),
                        "field": "content"
                      }
                    ]
                  }
            )
        })
    it('лайк поста', async () => {
      const {blog} = expect.getState()
      const {post} = expect.getState()
      const {userOne} = expect.getState()

      const userModelTwo: userInputModel = {
        login: 'nosorog',
        password: 'nosorog2023',
        email: 'panda@mail.com',
      }
      const userResponse = await createUser('admin', 'qwerty', userModelTwo)
      const userTwo = userResponse.createdUser
      const AccessTokenOne = await jwtService.createdJWTAccessToken(userOne.id)
      const headersJWTOne = {Authorization: `Bearer ${AccessTokenOne}`}
      const AccessTokeTwo = await jwtService.createdJWTAccessToken(new ObjectId(userTwo.id))
      const headersJWTTwo = {Authorization: `Bearer ${AccessTokeTwo}`}
      
      const likeStatusDataIncorect = {
        "likeStatus": ""
      }

      const getResultUpdateLikeIncorect = await request(app).put(`/posts/${post.id}/like-status`)
                    .set(headersJWTOne)
                    .send(likeStatusDataIncorect)
                    .expect(400)
      expect(getResultUpdateLikeIncorect.body).toEqual({
        "errorsMessages": [
          {
            "message": expect.any(String),
            "field": "likeStatus"
          }
        ]
      })       
      
      const likeStatusDataOne = {
        "likeStatus": "Dislike"
      }
      const likeStatusDataTwo = {
        "likeStatus": "Like"
      }


      const getResultUpdateLike = await request(app).put(`/posts/${post.id}/like-status`)
                    .set(headersJWTOne)
                    .send(likeStatusDataOne)
                    .expect(204)
      const getResultUpdateLikeTwo = await request(app).put(`/posts/${post.id}/like-status`)
                    .set(headersJWTTwo)
                    .send(likeStatusDataOne)
                    .expect(204)          


      const res = await request(app).get(`/posts/${post.id}`)      
      expect(res.body).toEqual({
          id: post.id,
          title: expect.any(String),
          shortDescription: expect.any(String),
          content: expect.any(String),
          blogId: blog.id,
          blogName: expect.any(String),
          createdAt: expect.any(String),
          extendedLikesInfo: {
            likesCount: 1,
            dislikesCount: 1,
            myStatus: "None",
            newestLikes: [{
              addedAt: expect.any(String),
              userId: userTwo.id,
              login: userTwo.login
            }]
          }
      })

   })


  })


    
})