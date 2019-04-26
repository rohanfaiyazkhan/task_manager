const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.port || 3000

app.use(express.json())

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then((user) => {
        res.status(201)
        res.send(user)
    }).catch((e) => {
        res.status(400)
        res.send(e)
    })
})

app.post('/task', (req, res) => {
    const task = new Task(req.body)
    task.save().then((task) => {
        res.status(201)
        res.send(task)
    }).catch((e) => {
        res.status(400)
        res.send(e)
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user)=> {
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        //console.log(e)
        res.status(500).send()
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((result)=>{
        res.send(result)
    }).catch((e)=> {
        res.status(500).send()
    })
})
