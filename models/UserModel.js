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
    // we don't need to define the password here because passport-local-mongoose
    // will take care of it for us
    // password: {
    //     type: String,
    //     minLength: 4,
    //     required: [true, "missing password"]
    // },
    created: {
        type: Date,
        default: Date.now
    }
})

userSchema.plugin(passportLocalMongoose);

// 2. Model

module.exports = mongoose.model("users", userSchema);
