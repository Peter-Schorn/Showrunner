const mongoose = require("mongoose");

// https://developers.themoviedb.org/3/configuration/get-api-configuration

const tmdbConfigurationSchema = new mongoose.Schema({
    images: {
        base_url: String,
        secure_base_url: String,
        backdrop_sizes: [String],
        logo_sizes: [String],
        poster_sizes: [String],
        profile_sizes: [String],
        still_sizes: [String]
    },
    change_keys: [String]
});

// https://mongoosejs.com/docs/api.html#mongoose_Mongoose-model
exports.TMDBConfiguration = mongoose.model(
    "TMDBConfiguration",  // model name
    tmdbConfigurationSchema,
    "configuration"  // collection name
);
