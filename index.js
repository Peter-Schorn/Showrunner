// allows access to .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('morgan');
app.use(logger('dev'));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// console.log(process.env);

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