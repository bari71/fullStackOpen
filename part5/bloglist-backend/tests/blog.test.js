const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const loginRouter = require('../controllers/login')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('total number of Likes', () => {
    test('test a number of blogs', async () => {
        const blogs = await helper.blogsInDb()
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, blogs.reduce((total, blog) => {
            return total + blog.likes
        }, 0))
    })
})

describe('Favorite blog with most likes', () => {
    test('favorite blog within a blog list', async () => {
        const blogs = await helper.blogsInDb()
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[2])
    })
})

describe('async/await for fetching all blogs', () => {
    test('test getting the correct number of blogs', async () => {
        const res = await api.get('/api/blogs')
        assert.strictEqual(res.body.length, 6)
    })
})

describe('check unique identifier property', () => {
    test('test that the identifier property of all blogs is named _id', async () => {
        const res = await api.get('/api/blogs')
        const blogs = res.body
        blogs.forEach(blog => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })
})

describe('HTTP Post requests', () => {
    test('test that posting a new blog increases the total number of blogs in the database by one', async () => {
        // 1. create a user
        const newUser = {
            username: 'newUser',
            name: 'new user',
            password: 'helloThere'
        }

        const createUserResult = await api
            .post('/api/users')
            .send(newUser)

        // 2. login with the user
        const loginObj = {
            username: newUser.username,
            password: newUser.password
        }

        const loginUserResult = await api
            .post('/api/login')
            .send(loginObj)

        // 3. post with the user
        const blogsAtStart = await helper.blogsInDb()
        
        const newBlog = {
            _id: "5a422a851b54a6a6234d17f7",
            title: "React patterns 2",
            author: "Michael Chanel",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUserResult.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const res = await api.get('/api/blogs')

        const titles = res.body.map(blog => blog.title)

        assert.strictEqual(res.body.length, blogsAtStart.length + 1)

        assert(titles.includes('React patterns 2'))
    })
})

describe('HTTP post requests with no properties given', () => {
    test('no likes property supplied when posting', async () => {
        // 1. create a user
        const newUser = {
            username: 'newUser',
            name: 'new user',
            password: 'helloThere'
        }

        const createUserResult = await api
            .post('/api/users')
            .send(newUser)

        // 2. login with the user
        const loginObj = {
            username: newUser.username,
            password: newUser.password
        }

        const loginUserResult = await api
            .post('/api/login')
            .send(loginObj)

        const newBlog = {
            _id: "5a422a851b54a6a6234d17f7",
            title: "React patterns 2",
            author: "Michael Chanel",
            url: "https://reactpatterns.com/",
            __v: 0
        }

        const res = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUserResult.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(res.body.likes, 0)
    })

    test('no title property supplied when posting', async () => {
        // 1. create a user
        const newUser = {
            username: 'newUser',
            name: 'new user',
            password: 'helloThere'
        }

        const createUserResult = await api
            .post('/api/users')
            .send(newUser)

        // 2. login with the user
        const loginObj = {
            username: newUser.username,
            password: newUser.password
        }

        const loginUserResult = await api
            .post('/api/login')
            .send(loginObj)

        const newBlog = {
            _id: "5a422a851b54a6a6234d17f7",
            author: "Michael Chanel",
            url: "https://reactpatterns.com/",
            __v: 0
        }

        const res = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUserResult.body.token}`)
            .expect(400)
    })

    test('no url property supplied when posting', async () => {
        // 1. create a user
        const newUser = {
            username: 'newUser',
            name: 'new user',
            password: 'helloThere'
        }

        const createUserResult = await api
            .post('/api/users')
            .send(newUser)

        // 2. login with the user
        const loginObj = {
            username: newUser.username,
            password: newUser.password
        }

        const loginUserResult = await api
            .post('/api/login')
            .send(loginObj)

        const newBlog = {
            _id: "5a422a851b54a6a6234d17f7",
            author: "Michael Chanel",
            __v: 0
        }

        const res = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${loginUserResult.body.token}`)
            .expect(400)
    })
})

describe('test DELETE HTTP request', () => {
    test.only('check successful deletion', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        // 1. create a user
        const newUser = {
            username: 'newUser',
            name: 'new user',
            password: 'helloThere'
        }

        const createUserResult = await api
            .post('/api/users')
            .send(newUser)

        // 2. login with the user
        const loginObj = {
            username: newUser.username,
            password: newUser.password
        }

        const loginUserResult = await api
            .post('/api/login')
            .send(loginObj)

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${loginUserResult.body.token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        const ids = blogsAtEnd.map(blog => blog.id)
        assert(!blogsAtEnd.includes(blogToDelete.id))
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
})

describe('test UPDATE HTTP request', () => {
    test('check successful update', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes - 1}

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogObj = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        assert.strictEqual(updatedBlogObj.likes, blogToUpdate.likes - 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})