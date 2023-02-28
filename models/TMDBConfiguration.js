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
        /** the base path for poster images  */
        imagePosterBasePath(preferredSize) {
            return this._imageBasePath(preferredSize, "poster_sizes");
        },
        /** the base path for backdrop images  */
        imageBackdropBasePath(preferredSize) {
            return this._imageBasePath(preferredSize, "backdrop_sizes");
        },

        _imageBasePath(preferredSize, imageType) {

            let size;

            if (this.images[imageType].includes(preferredSize)) {
                size = preferredSize;
            }
            else {
                size = this.images[imageType][0];
            }
            // `size` can only be `undefined` at this point if
            // `this.images[imageType]` is empty
            if (!size) {
                throw new Error(
                    `TMDBConfiguration.images.${imageType} is empty`
                );
            }
            return `${this.images.secure_base_url}${size}`;
        }
    }
});

// https://mongoosejs.com/docs/api.html#mongoose_Mongoose-model
exports.TMDBConfiguration = mongoose.model(
    "TMDBConfiguration",  // model name
    tmdbConfigurationSchema,
    "configuration"  // collection name
);
