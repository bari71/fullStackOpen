require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const password = process.argv[2]

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(results => {
        res.json(results)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(personObj => {
            res.json(personObj)
        })
})

app.get('/info', (req, res) => {
    const currTime = new Date()
    Person.countDocuments({})
        .then(result => {
            res.send(`Phonebook has info for ${result} people<br/>${currTime}`)
        })
})

app.delete('/api/persons/:id', function(req, res, next) {
    Person.findByIdAndDelete(req.params.id)
        .then(deletedPerson => {
            if (deletedPerson) {
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', function(req, res, next) {
    const body = req.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})