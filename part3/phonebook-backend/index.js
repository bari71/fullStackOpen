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
        console.log(results)
        res.json(results)
    })
})

app.get('/info', (req, res) => {
    const currTime = new Date()
    res.send(`Phonebook has info for ${persons.length} people<br/>${currTime}`)
})

app.get('/api/persons/:id', function(req, res) {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', function(req, res) {
    const id = req.params.id
    persons = persons.filter(function(p) {
        if (p.id !== id) {
            return true
        } else {
            return false
        }
    })
    res.status(204).end()
})

app.post('/api/persons', function(req, res) {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name/number missing'
        })
    }
    // if (checkNameExists(body.name)) {
    //    return res.status(400).json({
    //        error: 'Name already exists in phonebook'
    //    })
    //}
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const checkNameExists = (name) => {
    return persons.find(function(p) {
        if (p.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
            return true
        } else {
            return false
        }
    })
}

const findMaxNum = () => {
    const maxNum = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0
    return (String(maxNum + 1))
}
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})