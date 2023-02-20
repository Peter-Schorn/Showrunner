// allows access to .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const TMDB = require("./api").TMDB;
app.use(express.static('public'));
app.set('view engine', 'ejs');

const logger = require('morgan');
app.use(logger('dev'));

// console.log(process.env);

// DB CONNECTION

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
// mongoose.set("runValidators", true);

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

// update tmdb configuration

const updateTMDBConfiguration = require("./models/updateTMDBConfiguration").default;
updateTMDBConfiguration()

// const retrieveTMDBConfiguration = require("./models/updateTMDBConfiguration").retrieveTMDBConfiguration;
// retrieveTMDBConfiguration()

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

// --- example of calling the api ---

// // https://www.themoviedb.org/tv/1396-breaking-bad
// const breakingBadTVShowID = 1396;

// tmdb.tvShowDetails(breakingBadTVShowID)
//     .then((show) => {
//         console.log(
//             `tmdb.tvShowDetails callback: show.name: "${show.name}"`
//         );
//     })
//     .catch((error) => {
//         console.error("error from TMDB:", error);
//     });

// Route handlers

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

app.listen(port, () => {
    console.log(`Showrunner Server is listening on port ${port}`)
})
