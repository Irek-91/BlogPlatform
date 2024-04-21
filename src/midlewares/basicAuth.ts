import basicAuth from 'express-basic-auth'
const app = require('express')()

export const authMidleware = app.use(basicAuth({
    users: { 'admin': 'qwerty' }
}))
