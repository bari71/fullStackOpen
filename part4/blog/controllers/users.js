const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/api/users', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    res.json(users)
})

usersRouter.post('/api/users', async (req, res, next) => {
    try {
        const { username, name, password } = req.body
        const userExists = await User.findOne({ username: username })
        if (userExists) {
            return res.status(400).json({ error: 'user already exists with a similar username' })
        }
        if (password.length < 3) {
            return res.status(400).json({ error: 'password must be minimum 3 characters '})
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({
            username: username,
            name: name,
            passwordHash: passwordHash
        })
        const savedUser = await user.save()
        res.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter