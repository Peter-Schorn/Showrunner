require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const port = process.env.PORT ?? 3000;
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(logger("dev"));
mongoose.set("strictQuery", false);

// PASSPORT DEPENDENCIES
const passport = require("passport");
const expressSession = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");

// DB MODELS
const User = require("./models/UserModel");
const Show = require('./models/ShowModel');
const WatchProvider = ('./models/WatchProviderModel');
const {TMDBConfiguration} = require("./models/TMDBConfiguration");
const updateTMDBConfiguration = require("./models/updateTMDBConfiguration").default;

// API DEPENDENCY
const TMDB = require("./api").TMDB;


// DB CONNECTION

// Get connection variables from .env file
const {URI, DB, DB_USER, DB_PASS} = process.env;

// URL to connect to database
const connectionURL = `${URI}/${DB}`;

// Connection options
// See https://mongoosejs.com/docs/connections.html#options, https://mongodb.github.io/node-mongodb-native/4.2/interfaces/MongoClientOptions.html)
let connectionObject = {
    authSource: "admin",
    user: DB_USER,
    pass: DB_PASS,
    autoIndex: false
};

// Build the connection
mongoose.connect(connectionURL, connectionObject)
    .then(() => {
        console.log(`Connected to ${DB} database`)
    })
    .catch(error => console.log(`Error connecting to ${DB} database: ${error}`))


// USER AUTHENTICATION

// Create a session
const mongoStoreURL = `mongodb+srv://${DB_USER}:${DB_PASS}@bootcamp.doe2g0y.mongodb.net`;
app.use(expressSession({
    secret: "CV9tHTeLGh-eGieT_csDd_-fHk!W-WJZFofjDJN-",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoStoreURL})
}));

// Authentication strategy using local authentication
const strategy = new LocalStrategy(User.authenticate());
passport.use(strategy);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Authentication verification middleware - passed in to routes to verify the user is logged in. If not logged in, the user is redirected to the login page.
function verifyLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


// API CONNECTION

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

// Updates TMDB API Configuration every 24 hours 
// https://developers.themoviedb.org/3/configuration/get-api-configuration
setInterval(() => {
    updateTMDBConfiguration();
}, 86_400_000);  // 24 hours


// ROUTE HANDLERS

//PAGE ROUTES

// Root Route (landing.ejs)
app.get("/", (req, res)=>{
    res.render("landing.ejs");
})

// About
app.get("/about", (req, res) => {
    res.render("about.ejs");
})

// User Login
app.get("/login", (req, res) => {
    const failedAttempt = req.query.failedAttempt ?? false;
    res.render("login.ejs", {failedAttempt});
});

// User Home (Show list)
app.get("/home", (req, res) => {
    // `username` will be undefined if the user is not logged in
    const username = req.user?.username;
    const userId = req.user?._id
    res.render("home.ejs", { 
        username, 
        userId, 
        showId: []});
});

// Search - initiate a search and view results
app.get("/search", verifyLoggedIn, (req, res) => {
    const username = req.user.username;
    res.render("search.ejs", {username: username, shows: []});
});

// Signup
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

// Error page
app.get("/error", (req, res) => {
    res.render("error.ejs")
})

// FUNCTIONALITY ROUTES

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

// Logout (ends session) - https://www.passportjs.org/concepts/authentication/logout/
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
    const {query} = req.query;
    const userId = req.user._id;
    
    // Execute the functions in parallel using "Promise.all" instead of chaining them 
    Promise.all([
        TMDBConfiguration.findOne({}),
        tmdb.searchTVShows({query})
    ])
    .then(([configuration, searchResults]) => {
        const imagePosterBasePath = configuration.imagePosterBasePath("w92");
        res.render("search.ejs", {
            imagePosterBasePath,
            shows: searchResults.results, 
            userId
        });
    })
    .catch((error) => {
        console.error("/searchShows: error:", error);
        res.render("error.ejs")
    })
})
// Add a selected show from search results to the userShows object in the userModel (***in progress)
app.get("/addShow", verifyLoggedIn, (req, res)=>{
    const userId = req.user._id;
    const {showId} = req.query.showId

User.findByIdAndUpdate(
    {_id: req.user._id}, 
    {$push: {userShows: showId}},(error, success)=> {
        if(error) {
            console.log(error)
        } else {
            console.log(success)
            res.render("shows.ejs", {
                userId,
                showId, 
                success: success.userShows
            })
        }
    }
)

})


app.listen(port, () => {
    console.log(`Showrunner Server is running on http://localhost:${port}`)
})