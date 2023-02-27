const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const userShowSchema = mongoose.Schema({
    // userId comes from _id for user in users collection
    userId: {
        type: String,
        required: [true, "data is missing"]
    },
    showIds: [{
        // showId will come from API
        showId: {
            type: string,
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
            type: string
        }
    }]
})

// 2. Model

exports.UserShowModel = new mongoose.model('usershows', userShowSchema)
