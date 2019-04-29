const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.port || 3000

// app.use((req, res, next) => {
//     return res.status(503).send('Site under maintainence')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})

<<<<<<< HEAD
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

app.get('/task', (req, res) => {
    Task.find({}).then((result) => {
        res.send(result)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/task/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }).catch(e => {
        res.status(500).send()
    })
})
=======
>>>>>>> 3836d0471acb977e8223c243fbc4725b9bd91c8d
