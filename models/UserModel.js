const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const userSchema = mongoose.Schema({
    emailAddress: {
        type: String,
        minLength: 6,
        required: [true, "Email address not provided."]
    },
    password: {
        type: String,
        minLength: 4,
        required: [true, "Password not provided."]
    },
    firstName: {
        type: String,
        minLength: 2,
        required: [true, "First name not provided."]
    },
    lastName: {
        type: String,
        minLength: 2,
        required: [true, "Last name not provided."]
    },
    created: {
        type: Date, 
        default: Date.now()
    }
})

// 2. Model

exports.UserModel = new mongoose.model('users', userSchema)