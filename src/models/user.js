const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', { 
    name: {type: String, required: true, trim: true}, 
    age: 
    {
        type: Number,
        default: 0,
        validate: [ val => val >= 0, "Age cannot be less than 0."]
        
    },
    email:
    {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: [val => validator.isEmail(val), "Invalid email"],
        trim: true
    },
    password:
    {
        type: String,
        required: true,
        trim: true,
        validate: [
            {validator: val => val.length >= 6, msg: "Password must be at least 6 characters"},
            {validator: val => !val.toLowerCase().includes('password'), msg: `Password cannot contain 'password'`}
        ]
    }
})

module.exports = User