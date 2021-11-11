/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('person', (res) => JSON.stringify(res.body))
app.use(morgan('tiny', {
    skip(req, _res) { return req.method === 'POST' },
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person', {
    skip(req, _res) { return req.method !== 'POST' },
}))

const persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
]

app.get('/', (_request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (_request, response) => {
    console.log('route info is touched')
    Person.find({}).then((persons) => {
        response.send(`Phonebook has info for ${persons.length} people </br>${new Date()}`)
    })

    // response.send(`Phonebook has info for ${Person.find.length} people </br>${new Date()}`)
})

app.get('/api/persons', (_request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then((person) => {
            response.json(person)
        })
        .catch((error) => next(error))
})

const generateId = () => Math.floor(Math.random() * 100000)

app.post('/api/persons', (request, response, next) => {
    const { body } = request

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then((savedPerson) => {
            response.json(savedPerson)
        })
        .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { body } = request

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson)
        })
        .catch((error) => next(error))
})

// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     if (!body.name) {
//         return response.status(400).json({
//         error: 'name missing'
//         })
//     }
//     if (!body.number) {
//         return response.status(400).json({
//             error: 'number missing'
//         })
//     }

//     persons.map(person=>{
//         if (person.name === body.name){
//             return response.status(400).json({
//                 error: 'name must be unique'
//             })}
//     })

//     const person = {
//         id: generateId(),
//         name: body.name,
//         number: body.number
//     }

//     persons = persons.concat(person)

//     response.json(person)
//   })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((_result) => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } if (error.name === 'MongoServerError') {
        return response.status(400).send({ error: 'duplicate name' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).send(error.message)
    }

    next(error)
}
// have to be the last middleware
app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
