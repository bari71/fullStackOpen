const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {

    const authorization = req.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '')
    } else {
        req.token = null
    }

    next()
}

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid or missing' })
    }

    req.user = decodedToken.id

    next()
}

const errorHandler = (err, req, res, next) => {
    console.log(err)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({ error: 'expected `username` to be unique '})
    }
    next(err)
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}