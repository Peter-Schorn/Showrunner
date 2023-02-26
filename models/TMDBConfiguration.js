const mongoose = require("mongoose");

// https://developers.themoviedb.org/3/configuration/get-api-configuration

const tmdbConfigurationSchema = new mongoose.Schema({
    images: {
        required: true,
        type: {
            base_url: { type: String, required: true },
            secure_base_url: { type: String, required: true },
            backdrop_sizes: { type: [String], required: true },
            logo_sizes: { type: [String], required: true },
            poster_sizes: { type: [String], required: true },
            profile_sizes: { type: [String], required: true },
            still_sizes: { type: [String], required: true },
        }
    },
    change_keys: { type: [String], required: true },
}, {
    methods: {
        imageBasePath(size) {
            const theSize = size ?? "original";
            return `${this.images.secure_base_url}/${theSize}`;
        }
    }
});

// https://mongoosejs.com/docs/api.html#mongoose_Mongoose-model
exports.TMDBConfiguration = mongoose.model(
    "TMDBConfiguration",  // model name
    tmdbConfigurationSchema,
    "configuration"  // collection name
);
