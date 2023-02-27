const {UserModel} = require('./UserModel')

// Queries

// Create user data - enter info for each

function createUser() {
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
}

exports.createUser = createUser
