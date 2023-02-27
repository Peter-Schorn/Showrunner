const mongoose = require('mongoose')

// Blueprints

// 1. Schema

const showSchema = mongoose.Schema(
    {
        showId: { type: Number },
        showName: { type: String },
        backdropPath: { type: String },
        firstAirDate: { type: Date },
        genres: [
            {
                id: { type: Number },
                name: { type: String }
            }
        ],
        lastAirDate: { type: Date },
        lastEpisodeAired: {
            airDate: { type: Date },
            episodeNum: { type: Number },
            episodeId: { type: Number },
            name: { type: String },
            overview: { type: String },
            seasonNum: { type: Number },
            showId: { type: Number },
            stillPath: { type: String }
        },
        nextEpisodeAired: {
            airDate: { type: Date },
            episodeNum: { type: Number },
            episodeId: { type: Number },
            name: { type: String },
            overview: { type: String },
            seasonNum: { type: Number },
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
        posterPath: { type: String },
        seasons: [
            {
                airDate: { type: Date },
                episodeCount: { type: Number },
                seasonId: { type: Number },
                name: { type: String },
                overview: { type: String },
                posterPath: { type: String },
                seasonNum: { type: Number }
            }
        ],
        status: { type: String },
        tagline: { type: String },
        voteAvg: { type: Number },
        voteCount: { type: Number }
    }
)

// 2. Model

exports.ShowModel = new mongoose.model('shows', showSchema)
