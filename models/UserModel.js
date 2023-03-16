const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Blueprints

// 1. Schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 4,
        required: [true, "missing username"]
    },
    email: {
        type: String,
        minLength: 4
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    // we don't need to define the password here because passport-local-mongoose will take care of it for us
    created: {
        type: Date,
        default: Date.now
    },
    // The array of ShowIds that a user has added to their list. It gets added the first time a show is added to the list.
    userShows:
        [{
        showId: {
        type: String,
        required: [true, 'Show ID is missing']
        },
        hasWatched: {
            type: Boolean,
            default: false
        },
        favorite: {
            type: Boolean,
            default: false
        }
    }]
})

userSchema.plugin(passportLocalMongoose);

// 2. Model

module.exports = mongoose.model("User", userSchema);
