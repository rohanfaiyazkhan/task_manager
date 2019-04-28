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

