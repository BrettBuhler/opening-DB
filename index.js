require('dotenv').config()
const express = require('express')
const User = require('./models/users')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())

app.get('/api/users', (req, res, next) => {
    User.find({}).then(users => {
        res.json(users)
    })
})

app.put('api/users/:userName', (req, res, next) => {
    const body = req.body
    const user = {
        openings: {
            
        }
    }
    console.log(openings)
    User.findOneAndUpdate(req.params.userName, openings, {new: true})
        .then(updatedOpening => {
            res.json(updatedOpening)
        })
        .catch(error => next(error))
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

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})