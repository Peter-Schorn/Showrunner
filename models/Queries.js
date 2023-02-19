// This file is storage for DB functionality...need to figure out how to organize so that index.js doesn't get unruly. This version of Schema/Model works when directly part of the index.js file (not imported from models). It also includes the queries used for CRUD functionality...I used them to add data directly to the DB for testing purposes (no routes, variables, etc.)


// CREATE USER

// Blueprint

// 1 - Schema

const userSchema = mongoose.Schema({
    emailAddress: {
        type: String,
        minLength: 6,
        required: [true, "no data provided"]
    },
    password: {
        type: String,
        minLength: 4,
        required: [true, "no data provided"]
    },
    firstName: {
        type: String,
        minLength: 2,
        required: [true, "no data provided"]
    },
    lastName: {
        type: String,
        minLength: 2,
        required: [true, "no data provided"]
    },
    created: {
        type: Date, 
        default: Date.now()
    }
})

// 2 - Model

const UserModel = new mongoose.model('users', userSchema)

// Queries

// Create user data - enter info for each

let newUser = new UserModel({
    emailAddress: '',
    password: '',
    firstName: '',
    lastName: ''
})

// Save user to the database

newUser.save((err, data)=>{
    if(err){
        console.log(`There was an error saving new user data to the db: `,err.message)
    } else {
        console.log(`New User was saved!`);
        console.log(data);
    }
})