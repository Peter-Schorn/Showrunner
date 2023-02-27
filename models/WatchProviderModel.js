const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const watchProviderSchema = mongoose.Schema({
    showId: { type: Number },
    results: [
        {
            US: {
                    link: { type: String },
            buy: [
                {

                }
            ]
            }
    }
]
})

// 2. Model

exports.WatchProviderModel = new mongoose.model('watchProviders', watchProviderSchema)
