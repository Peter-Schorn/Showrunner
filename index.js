// allows access to .env file
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const port = process.env.PORT || 3000;

const TMDB = require("./api").TMDB;
app.use(express.static('public'));
app.set('view engine', 'ejs');

const logger = require('morgan');
app.use(logger('dev'));

// console.log(process.env);

// DB CONNECTION

// get connection variables from .env file
const {URI, DB, DB_USER, DB_PASS} = process.env;

// url to connect to database

let url = `${URI}/${DB}`;

// connection options

let connectionObject = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    user: DB_USER,
    pass: DB_PASS,
};

// build connection

mongoose.connect(url, connectionObject)
.then(()=> console.log(`Connected to ${DB} database`))
.catch(error=> console.log(`Error connecting to ${DB} database: ${error}`))

// API CONNECTION

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

// --- example of calling the api ---
//
// // https://www.themoviedb.org/tv/1396-breaking-bad
// const breakingBadTVShowID = 1396;
//
// tmdb.tvShowDetails(breakingBadTVShowID)
//     .then((show) => {
//         console.log(
//             `tmdb.tvShowDetails callback: show.name: "${show.name}"`
//         );
//     })
//     .catch((error) => {
//         console.error("error from TMDB:", error);
//     });

// ROUTE HANDLERS

app.get('/', (req, res)=>{
    res.redirect('/home');
})

// ABOUT PAGE
app.get('/about', (req, res) => {
    res.render('about.ejs');
})

app.get('/home', (req, res) => {
    // do something
    res.render('home.ejs');
})

app.get('/error', (req, res) =>
res.render('error.ejs'))

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

// // Create user data

// let newUser = new UserModel({
//     emailAddress: '',
//     password: '',
//     firstName: '',
//     lastName: ''
// })

// // Save user to the database

// newUser.save((err, data)=>{
//     if(err){
//         console.log(`There was an error saving new user data to the db: `,err.message)
//     } else {
//         console.log(`New User was saved!`);
//         console.log(data);
//     }
// })







app.listen(port, () => {
    console.log(`Showrunner Server is listening on port ${port}`)
})
