const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        user.tokens.push({ token })
        await user.save()
        res.status(201)
        res.send({user, token})
    }catch(e){
        
        res.status(400)
        res.send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    try{
        res.send(req.user)
    }catch(e){
        res.send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.tokens.push({ token })
        await user.save()
        res.send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
             return res.status(404).send()
         }
         res.send(user)
    }catch(e){
        res.status(500).send()
    }
})



router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every( update => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({'error':'Invalid updates'})
    }

    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        //console.log(e)
        res.status(500).send()
    }
})

router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router