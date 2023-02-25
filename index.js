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


const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);
const baseUrl = 'https://www.themoviedb.org/'

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
    
    res.render('home.ejs', {showId: []});
})

app.get('/search', (req, res) => {

    res.render('search.ejs', {shows: []});
})


app.get('/searchShows', (req, res)=>{
    // let route = 'search/tv'
    let {query} = req.query
    console.log({query})
    tmdb.searchTVShows({query})
    .then((result) => {
            console.log(result.results)
            res.render('search.ejs', {shows: result.results})
        })
    .catch((error) => {
        console.log('error: ', error);
        res.render('error.ejs')
    })
})

app.get('/addShow', (req, res)=>{
let {showId} = req.query
console.log(showId)
    res.render('home.ejs', {showId: showId})
})


app.get('/error', (req, res) =>
res.render('error.ejs'))

app.listen(port, () => {
    console.log(`Showrunner Server is listening on port ${port}`)
})
