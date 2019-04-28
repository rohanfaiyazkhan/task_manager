const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema  = new mongoose.Schema({ 
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
        unique: true,
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
    }, 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    return jwt.sign({ _id: this._id.toString() }, 'darkmistynight')
}

userSchema.methods.toJSON = function(){
    try{
        const user = this.toObject()
        delete user.password
        delete user.tokens
        return user
    }catch(e){
        throw e
    }
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error(`Unable to login`)
    }

    if(!bcrypt.compare(password, user.password)){
        
        throw new Error(`Unable to login`)
    }

    return user
}

// Hash the plaintext password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User