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
const {TMDBConfiguration}  = require("./models/TMDBConfiguration");
const updateTMDBConfiguration = require("./models/updateTMDBConfiguration");
const refreshShowModel = require("./models/refreshShowModel");

const {
    addShowToDatabase,
    addShowToUserList,
    retrieveShow,
    userFullShows,
    deleteUserShow
} = require("./models/updateShowModel");

const { updateUserProfile } = require("./models/updateUserModel");

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
    pass: DB_PASS
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


function performMaintenance() {
    updateTMDBConfiguration();
    refreshShowModel();
}
// always set to "true" for `npm run watch`
if (process.env.DISABLE_INITIAL_MAINTENANCE !== "true") {
    performMaintenance();
}
setInterval(performMaintenance, 86_400_000);  // 24 hours


// ROUTE HANDLERS

//PAGE ROUTES

// Root Route (landing.ejs)
app.get("/", (req, res)=>{
    res.render("landing.ejs",);
})

// About
app.get("/about", (req, res) => {
    const username = req.user?.username;
    res.render("about.ejs", {username});
})

// User Login
app.get("/login", (req, res) => {
    const failedAttempt = req.query.failedAttempt ?? false;
    const username = req.user?.username;
    res.render("login.ejs", {username, failedAttempt});
});

// User Home (Show list)
app.get("/home", (req, res) => {
    // `username` will be undefined if the user is not logged in
    const username = req.user?.username;
    res.render("home.ejs", {username, showId: []});
});

// Search - initiate a search and view results
app.get("/search", verifyLoggedIn, (req, res) => {
    const username = req.user?.username;
    res.render("search.ejs", {username, shows: [], existingShows: []});
  })

// Shows Page
app.get('/shows', verifyLoggedIn, (req, res) => {
    const username = req.user?.username;
    const userShows = req.user.userShows;
    console.log(`This is the list of user shows: ${userShows}`)
    res.render('shows.ejs', {username, userShows});
});

// Signup
app.get("/signup", (req, res) => {
    const username = req.user?.username;
    res.render("signup.ejs", {username});
});

// Profile page
app.get("/profile", verifyLoggedIn, (req, res) => {
    const user = req.user;
    // for display purposes, we want to display an empty string for missing
    // properties, not "undefined"
    const keys = ["firstName", "lastName", "email"];
    for (const key of keys) {
        if (!user[key]) {
            user[key] = "";
        }
    }
    res.render("profile.ejs", {user});
});

// Change Password Page
app.get("/change-password", verifyLoggedIn, (req, res) => {
    const user = req.user;
    const failedAttempt = req.query.failedAttempt ?? false;
    res.render("change_password.ejs", {user, failedAttempt});
});

app.post("/update-profile", (req, res) => {
    const userId = req.user._id;
    const { firstName, lastName, email } = req.body;

    const options = {
        firstName: firstName === "" ? null : firstName,
        lastName: lastName === "" ? null : lastName,
        email: email === "" ? null : email
    };

    updateUserProfile(userId, options)
        .then(() => {
            res.redirect("/profile");
        })
        .catch(error => {
            console.log(`Error updating user profile: ${error}`);
            res.redirect("/error");
        });
});

// Error page
app.get("/error", (req, res) => {
    res.render("error.ejs");
});



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

// Logout (ends session)
// https://www.passportjs.org/concepts/authentication/logout/
app.get("/logout", (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        res.redirect("/");
    });
});

app.post("/change-password", (req, res) => {
    req.user.changePassword(req.body.oldPassword, req.body.newPassword, (error) => {
        if (error) {
            console.log(`Error changing password: ${error}`);
            res.redirect("/change-password?failedAttempt=true");
        }
        else {
            console.log("Password changed successfully");
            res.redirect("/home");
        }
    });
});

// Send a search query to the TMDB API and return results to the user
app.get("/searchShows", verifyLoggedIn, (req, res)=>{
    // let route = "search/tv"
    const {query} = req.query;
    const username = req.user.username;
    const existingShows = req.user.userShows.map( show => show.showId);

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
            username,
            existingShows
        });
    })
    .catch((error) => {
        console.error("/searchShows: error:", error);
        res.render("error.ejs")
    })
})

// Add a selected show from search results to the userShows object in the userModel
app.post("/addShow", verifyLoggedIn, (req, res)=>{
    const username = req.user.username;
    const showId = req.body.showId;

    addShowToUserList(req.user._id, showId)
        .then((result) => {
            console.log(result);
            res.redirect("/shows");
        })
        .catch((error) => {
            console.error(error);
            res.sendStatus(500);
        });

})

app.get("/full-shows", verifyLoggedIn, (req, res) => {
    console.log(`req.user._id: "${req.user._id}"`);

    Promise.all([
        TMDBConfiguration.findOne({}),
        userFullShows(req.user._id)
    ])
    .then(([configuration, shows]) => {
        const imagePosterBasePath = configuration.imagePosterBasePath("w92");
        console.log(`imagePosterBasePath: ${imagePosterBasePath}`);
        console.log("\n\nFULL SHOWS:", shows);
        res.send(shows);
    })
    .catch((error) => {
        console.error(error);
        res.sendStatus(500);
    });

});

app.get("/show", verifyLoggedIn, (req, res) => {

    const {showId} = req.query;
    const {username} = req.user;

    if (!showId) {
        res.status(400).send("missing 'showId' query parameter");
        return;
    }

    Promise.all([
        TMDBConfiguration.findOne({}),
        // retrieves a full show object with the user show object inside it
        retrieveShow(req.user._id, showId)
    ])
    .then(([configuration, show]) => {
        const imagePosterBasePath = configuration.imagePosterBasePath("w92");
        console.log(`imagePosterBasePath: ${imagePosterBasePath}`);
        const fullPosterPath = show.posterPath ? `${imagePosterBasePath}${show.posterPath}` : "movie_poster_placeholder.svg";
        console.log(show);
        if (!show) {
            // gets caught by the catch block directly below
            throw new Error("could not find show in database or in TMDB api");
        }
        res.render("showDetail.ejs", {fullPosterPath, show, username});
    })
    .catch((error) => {
        console.error(error);
        res.sendStatus(400);
    });

});

app.post("/deleteUserShow", verifyLoggedIn, (req, res) => {

    const showId = req.body.showId;
    if (!showId) {
        res.sendStatus(400);
        return;
    }
    console.log(`delete showId: ${showId} for user ${req.user.username}`);

    deleteUserShow(req.user._id, showId)
        .then((result) => {
            console.log("result from deleteUserShow:", result);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error("error deleteUserShow:", error);
            res.sendStatus(400);
        });

});

app.listen(port, () => {
    console.log(`Showrunner Server is running on http://localhost:${port}`)
});
