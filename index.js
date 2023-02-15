// allows access to .env file
// require('dotenv').config();
const TMDB = require("./api").TMDB;

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('morgan');
app.use(logger('dev'));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// console.log(process.env);

// const apiKey = process.env.TMDB_API_KEY_V4;
// const tmdb = new TMDB(apiKey);

// --- example of calling the api ---
//
// https://www.themoviedb.org/tv/1396-breaking-bad
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
