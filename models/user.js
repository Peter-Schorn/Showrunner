const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    emailAddress: String,
    firstName: String,
    lastName: String,
    created: String
})

module.exports = mongoose.model('User', UserSchema)