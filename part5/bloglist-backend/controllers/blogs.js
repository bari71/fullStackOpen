const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
    res.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (req, res) => {
    const user = req.user
    const blog = new Blog(req.body)

    blog.likes = blog.likes | 0
    blog.user = user.id

    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'title/URL missing' })
    }

    user.blogs = user.blogs.concat(blog.id)
    await user.save()

    const savedBlog = await blog.save()

    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.status(204).end()
    }

    if (user.id.toString() !== blog.user.toString()) {
        return res.status(403).json({ error: 'unauthorized: not blog owner' })
    }

    user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())

    await blog.deleteOne()
    return res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
    const { title, author, url, likes } = req.body

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()

    res.json(200).json(updatedBlog)
})

module.exports = blogRouter