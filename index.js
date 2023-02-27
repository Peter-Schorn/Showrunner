require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT ?? 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);
const logger = require("morgan"); 
app.use(logger("dev"));

// PASSPORT DEPENDENCIES
const passport = require("passport");
const expressSession = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const User = require("./models/UserModel");

// DB MODEL DEPENDENCIES
const UserShowModel = require('./models/UserShowModel');
const ShowModel = require('./models/ShowModel');
const WatchProviderModel = require('./models/WatchProviderModel');

// API DEPENDENCY
const TMDB = require("./api").TMDB;

// DB CONNECTION

// get connection variables from .env file
const {URI, DB, DB_USER, DB_PASS} = process.env;

// url to connect to database
const connectionURL = `${URI}/${DB}`;

// connection options (See https://mongoosejs.com/docs/connections.html#options, https://mongodb.github.io/node-mongodb-native/4.2/interfaces/MongoClientOptions.html)
let connectionObject = {
    authSource: "admin",
    user: DB_USER,
    pass: DB_PASS,
    autoIndex: false
};

// build connection

mongoose.connect(connectionURL, connectionObject)
    .then(() => {
        console.log(`Connected to ${DB} database`)
    })
    .catch(error => console.log(`Error connecting to ${DB} database: ${error}`))

// not entirely sure what this does except create a session....is this for DB or User Auth or both?
const mongoStoreURL = `mongodb+srv://${DB_USER}:${DB_PASS}@bootcamp.doe2g0y.mongodb.net`;
app.use(expressSession({
    secret: "CV9tHTeLGh-eGieT_csDd_-fHk!W-WJZFofjDJN-",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoStoreURL})
}));


// USER AUTHENTICATION

const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Authentication Verification Middleware
function verifyLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


// API CONNECTION

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);


// ROUTE HANDLERS

// PAGE ROUTES

// Landing page (root route)
app.get("/", (req, res)=>{
    res.render("landing.ejs");
});

// Login page
app.get("/login", (req, res) => {
    const failedAttempt = req.query.failedAttempt ?? false;
    res.render("login.ejs", { failedAttempt });
});

// User Home page
app.get("/home", (req, res) => {
    // `username` will be undefined if the user is not logged in
    const username = req.user?.username;
    res.render("home.ejs", { username: username, showId: []});
});

// About page
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Signup page
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Search page - initiate a search and view results
app.get("/search", verifyLoggedIn, (req, res) => {
    const username = req.user.username;
    res.render("search.ejs", {username: username, shows: []});
});

// Shows page (**this page might be eliminated - currently using it as a testing ground)
app.get("/shows", verifyLoggedIn, (req, res) => {
    const username = req.user.username;
    res.render("shows.ejs", {username: username, showId: []});
});

// ACTION ROUTES

// Create a user account using passport
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
                passport.authenticate("local") (req, res, () => {
                    res.redirect("/home");
                });
            }
        }
    )
});

// Login using passport authentication
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login?failedAttempt=true",
    successRedirect: "/home",
    failureMessage: "the failure message"
}), (error, req, res, next) => {
    if (error) {
        next(error);
    }
});

// Logout and end session - https://www.passportjs.org/concepts/authentication/logout/
app.get("/logout", (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        res.redirect("/");
    });
});

// Send a search query to the TMDB API and return results to the user
app.get("/searchShows", verifyLoggedIn, (req, res)=>{
    // let route = "search/tv"
    const {query} = req.query
    const username = req.user.username;
    tmdb.searchTVShows({query})
    .then((result) => {
        res.render("search.ejs", {username: username, shows: result.results})
    })
    .catch((error) => {
        console.error("/searchShows: error:", error);
        res.render("error.ejs")
    })
})

// Add a selected show from search results to the UserShows collection (***in progress) 
app.get("/addShow", verifyLoggedIn, (req, res)=>{
    const username = req.user?.username;
    const showId = req.query.showId
    res.render("shows.ejs", {username: username, showId: showId})
})



// Error Route
app.get("/error", (req, res) => {
    res.render("error.ejs")
})

// LISTENER

app.listen(port, () => {
    console.log(`Showrunner Server is running on http://localhost:${port}`)
})
