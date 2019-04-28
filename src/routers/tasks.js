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

router.get('/task/:id', async (req, res) => {
    const _id = req.params.id
    
    try{
        const task = await Task.findById(_id)
        if(!task){
             return res.status(404).send()
         }
    }catch(e){
        res.status(500).send()
    }
})

router.get('/task', async (req, res) => {
    try{
        const result = await Task.find({})
        res.send(result)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/task/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'completed']
    const isValid = updates.every( update => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({'error':'Invalid updates'})
    }

    try{
        const task = await Task.findById(req.params.id)
        updates.forEach(update => task[update] = req.body[update])
        await task.save()        
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/task/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router