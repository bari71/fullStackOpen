const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const { test, describe, beforeEach, after } = require('node:test')
const app = require('../app')
const mongoose = require('mongoose')
const { asyncWrapProviders } = require('node:async_hooks')
const api = supertest(app)

describe('Test one user in DB', () => {
    beforeEach(async () => {
        await User.deleteMany()
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'root',
            passwordHash: passwordHash
        })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'ab',
            name: 'Bari',
            password: '12345678910',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('minimum'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            name: 'Bari',
            username: '',
            password: '12345678910'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('required'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails with pre-existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'abari',
            name: 'Bari',
            password: '12',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('minimum'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})
