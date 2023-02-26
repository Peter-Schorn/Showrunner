require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const TMDB = require("./api").TMDB;

// passport dependencies
const passport = require("passport");
const expressSession = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const User = require("./models/UserModel");

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(logger("dev"));

mongoose.set("strictQuery", false);

// DB CONNECTION

// get connection variables from .env file
const {URI, DB, DB_USER, DB_PASS} = process.env;

// url to connect to database

const connectionURL = `${URI}/${DB}`;

// connection options
// https://mongoosejs.com/docs/connections.html#options
// https://mongodb.github.io/node-mongodb-native/4.2/interfaces/MongoClientOptions.html
let connectionObject = {
    authSource: "admin",
    user: DB_USER,
    pass: DB_PASS,
    autoIndex: false
};

const mongoStoreURL = `mongodb+srv://${DB_USER}:${DB_PASS}@bootcamp.doe2g0y.mongodb.net`;
app.use(expressSession({
    secret: "CV9tHTeLGh-eGieT_csDd_-fHk!W-WJZFofjDJN-",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoStoreURL})
}));

const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// build connection

mongoose.connect(connectionURL, connectionObject)
    .then(() => {
        console.log(`Connected to ${DB} database`)
    })
    .catch(error => console.log(`Error connecting to ${DB} database: ${error}`))

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


// Route handlers

app.get("/", (req, res)=>{
    res.redirect("/home");
})

app.get("/home", (req, res) => {
    res.render("home.ejs", {showId: []});
})

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", (req, res) => {
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        (error, response) => {
            if (error) {
                res.send(error);
            }
            else {
                console.log(`response from signup: ${response}`);
                res.redirect("/home");
            }
        }
    )
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/home"
}), (error, req, res, next) => {
    if (error) {
        next(error);
    }
});

app.get("/search", (req, res) => {
    res.render("search.ejs", {shows: []});
})

app.get("/searchShows", (req, res)=>{
    // let route = "search/tv"
    const { query } = req.query
    console.log({query})
    tmdb.searchTVShows({query})
        .then((result) => {
            console.log(result.results)
            res.render("search.ejs", {shows: result.results})
        })
        .catch((error) => {
            console.error("/searchShows: error:", error);
            res.render("error.ejs")
        })
})

app.get("/addShow", (req, res)=>{
let {showId} = req.query
console.log(showId)
    res.render("home.ejs", {showId: showId})
})


app.get("/error", (req, res) => {
    res.render("error.ejs")
})

app.listen(port, () => {
    console.log(`Showrunner Server is running on http://localhost:${port}`)
})
