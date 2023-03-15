const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const watchProviderSchema = new mongoose.Schema({
    link: { type: String },
    flatrate: [
        {
            displayPriority: { type: Number },
            logoPath: { type: String },
            providerId: { type: Number },
            providerName: { type: String }
        }
    ],
    rent: [
        {
            displayPriority: { type: Number },
            logoPath: { type: String },
            providerId: { type: Number },
            providerName: { type: String }
        }
    ],
    buy: [
        {
            displayPriority: { type: Number },
            logoPath: { type: String },
            providerId: { type: Number },
            providerName: { type: String }
        }
        
    ]
});

const showSchema = new mongoose.Schema(
    {
        showId: { type: Number },
        show_name: { type: String },
        backdropPath: { type: String },
        firstAirDate: { type: Date },
        genres: [
            {
                id: { type: Number },
                name: { type: String }
            }
        ],
        lastAirDate: { type: Date },
        lastEpisodeToAir: {
            airDate: { type: Date },
            episodeNumber: { type: Number },
            id: { type: Number },
            name: { type: String },
            overview: { type: String },
            seasonNumber: { type: Number },
            showId: { type: Number },
            stillPath: { type: String }
        },
        nextEpisodeToAir: {
            airDate: { type: Date },
            episodeNumber: { type: Number },
            id: { type: Number },
            name: { type: String },
            overview: { type: String },
            seasonNumber: { type: Number },
            showId: { type: Number },
            stillPath: { type: String }
        },
        networks: [
            {
                networkId: { type: Number },
                name: { type: String },
                logoPath: { type: String }
            }
        ],
        episodeCount: { type: Number },
        seasonCount: { type: Number },
        overview: { type: String },
        popularity: { type: Number },
        seasons: [
            {
                airDate: { type: Date },
                episodeCount: { type: Number },
                id: { type: Number },
                name: { type: String },
                overview: { type: String },
                posterPath: { type: String },
                seasonNumber: { type: Number }
            }
        ],
        status: { type: String },
        tagline: { type: String },
        voteAverage: { type: Number },
        voteCount: { type: Number },
        // https://mongoosejs.com/docs/schematypes.html#maps
        watchProviders: {
            type: Map,
            of: watchProviderSchema
        }
    }
)

// 2. Model

module.exports = mongoose.model('Show', showSchema)
