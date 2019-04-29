const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter: function(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload image file only'))
        }

        cb(undefined, true)
    }
})

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

router.post('/users/me/avatar', upload.single('avatar'), auth, async (req, res) => {
    res.send()
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
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send()
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



router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every( update => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({'error':'Invalid updates'})
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()


        res.send(req.user)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        //console.log(e)
        res.status(500).send()
    }
})

module.exports = router