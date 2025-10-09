const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


blogRouter.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
    res.json(blogs)
})

blogRouter.post('/api/blogs', middleware.userExtractor, async (req, res) => {
    const body = req.body

    if (!req.user) {
        return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(req.user)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    if (!blog.title || !blog.url) {
        return res.status(400).json({ error: 'title/URL missing' })
    }

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogRouter.delete('/api/blogs/:id', middleware.userExtractor, async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== req.user.toString()) {
        return res.status(403).json({ error: 'unauthorized: not blog owner' })
    }

    await Blog.findByIdAndDelete(req.params.id)

    return res.status(204).end()
})

blogRouter.put('/api/blogs/:id', async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(200).json(updatedBlog)
})

module.exports = blogRouter