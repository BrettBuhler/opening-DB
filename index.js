require('dotenv').config()
const express = require('express')
const User = require('./models/users')
const app = express()
const mongoose = require('mongoose')
const { response } = require('express')
const morgan = require('morgan')
app.use(express.json())

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req,res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

app.get('/api/users', (req, res, next) => {
    User.find({}).then(users => {
        res.json(users)
    })
})

app.delete('/api/users/:userName', (req, res) => {
    User.findOneAndDelete({userName: req.params.userName})
        .then(user => {
            res.json(user)
        })
})


app.get('/api/users/:userName', (req, res, next) => {
    User.findOne({userName: req.params.userName}).then(user => {
        if(user){
            res.json(user)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})


app.post('/api/users', (req, res) => {
    const body = req.body
    if (!body.userName){
        return res.status(400).json({
            error: 'Missing User Name'
        })
    }
    const person = new User({
        openings: body.openings,
        userName: body.userName
    })
    person.save().then(savedUser => {
        res.json(savedUser)
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
