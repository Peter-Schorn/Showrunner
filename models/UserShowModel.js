const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const userShowSchema = mongoose.Schema({
    // username comes user in users collection
    username: {
        type: String,
        required: [true, "data is missing"]
    },
    showId: {
            type: String,
            required: [true, 'data is missing']
        },
        // user can mark a show as watched...consider using filters to show list excluding or only hasWatched = true
        hasWatched: {
            type: Boolean,
            default: false
        },
        favorite: {
            type: Boolean,
            default: false
        },
        rating: {
            type: String
        }
})

// 2. Model

module.exports = mongoose.model('userShow', userShowSchema)