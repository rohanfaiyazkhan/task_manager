const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/task', auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try{
        await task.save()
        res.status(201)
        res.send(task)
    }catch(e){
        res.status(400)
        res.send(e)
    }
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    
    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
             return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const [selection, order] = req.query.sortBy.split('_')
        sort[selection] = order === 'asc' ? 1 : -1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'completed']
    const isValid = updates.every( update => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({'error':'Invalid updates'})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user.id})

        if(!task){
            res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()        
        res.send(task)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router