const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const userSchema = mongoose.Schema({
    emailAddress: {
        type: String,
        minLength: 6,
        required: [true, "no data provided"]
    },
    password: {
        type: String,
        minLength: 4,
        required: [true, "no data provided"]
    },
    firstName: {
        type: String,
        minLength: 2,
        required: [true, "no data provided"]
    },
    lastName: {
        type: String,
        minLength: 2,
        required: [true, "no data provided"]
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

// 2. Model

exports.UserModel = new mongoose.model('users', userSchema)