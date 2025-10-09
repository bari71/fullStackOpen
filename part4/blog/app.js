const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.dbUrl)

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(blogRouter)
app.use(usersRouter)
app.use(loginRouter)
app.use(middleware.errorHandler)


module.exports = app