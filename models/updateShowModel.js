const mongoose = require("mongoose");
const ShowModel = require("./ShowModel");
const UserModel = require("./UserModel");
const { TMDB } = require("../api");

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

/**
 * Adds a show to the database.
 * 
 * @param {string} showId the show id
 * @returns {*} the result of adding the show to the database
 */
exports.addShowToDatabase = function(showId) {
    
    console.log(`addShowToDataBase: ${showId}`);
    
    return tmdb.tvShowDetailsAndWatchProviders(showId)
        .then((tvShowDetails) => {
            console.log(tvShowDetails);
            
            // https://mongoosejs.com/docs/api/model.html#model_Model-findOneAndUpdate
            return ShowModel.findOneAndUpdate({ showId }, {
                showId: tvShowDetails.id,
                showName: tvShowDetails.name,
                backdropPath: tvShowDetails.backdrop_path,
                firstAirDate: tvShowDetails.first_air_date,
                lastAirDate: tvShowDetails.last_air_date,
                lastEpisodeAired: tvShowDetails.last_episode_to_air,
                nextEpisodeToAir: tvShowDetails.next_episode_to_air,
                genres: tvShowDetails.genres,
                networks: tvShowDetails.watch_providers.results,
                episodeCount: tvShowDetails.number_of_episodes,
                seasonCount: tvShowDetails.number_of_seasons,
                overview: tvShowDetails.overview,
                popularity: tvShowDetails.popularity,
                seasons: tvShowDetails.seasons,
                status: tvShowDetails.status,
                tagline: tvShowDetails.tagline,
                voteAvg: tvShowDetails.vote_average,
                voteCount: tvShowDetails.vote_count
            }, {
                upsert: true,
                returnDocument: "after"
            });
            
        })
        .catch((error) => {
            console.error("addShowToDataBase:", error);
            throw error;
        });
        
};

/**
 * Retrieve a show from the database or from the TMDB api.
 * 
 * If the show was not already in the database, then it will be added.
 * 
 * @param {string} showId the show id
 * @returns {*} a promise that resolves to a show object
 */
exports.retrieveShow = function(showId) {
    
    return ShowModel.findOne({ showId })
        .then((show) => {
            if (show) {
                return show;
            }
            else {
                return exports.addShowToDatabase(showId);
            }
        });
    
};

/**
 * Retrieves the full show objects for a given user.
 * 
 * First checks database, then falls back on TMDB api, and saves returned data
 * back into database.
 * 
 * @param {string} userId the user id
 * @returns {*} a promise that resolves to an array of show objects
 */
exports.userFullShows = function(userId) {
    
    return UserModel.findById(userId)
        .then((user) => {
            
            const showIds = (user?.userShows ?? []).map((show) => `${show?.showId}`);
            
            return ShowModel.find({ "showId": { $in: showIds } }).then((showObjects) => {
                
                const foundIds = showObjects.map(show => `${show?.showId}`);
                const remainingIds = showIds.filter((id) => {
                    return !foundIds.includes(id);
                });
                
                // console.log({showIds});
                // console.log({foundIds});
                // console.log({remainingIds});
                
                const addToDatabasePromises = remainingIds.map((id) => {
                    return exports.addShowToDatabase(id);
                })
                console.log(
                    `addToDatabasePromises.length: ${addToDatabasePromises.length}`
                );
                return Promise.all(addToDatabasePromises).then((shows) => {
                    return showObjects.concat(shows);
                });
            });
            
        });
        
};

/**
 * Deletes a show from a user's list. If the show is not in any other user's,
 * list, then delete it from the shows collection.
 * 
 * @param {string} userId the user id
 * @param {string} showId the show id
 * @returns {*} a promise that resolves to the result of removing the show from 
 * the user's list
 */
exports.deleteUserShow = function(userId, showId) {
    
    // find all other users that have this show in their list
    UserModel.find(
        {
            _id: { $ne: userId }, 
            "userShows.showId": showId 
        },
    )
    .then((users) => {
        
        console.log(`all other users with show ${showId}:`, users);
        
        if (users && users.length > 0) {
            // there are other users with this show in their list, so don't 
            // delete it from the shows collection
            return;
        }
        
        // there are no other users with this show in their list, so delete it
        // from the shows collection
        ShowModel.deleteOne({showId})
            .then((result) => {
                console.log(`deleteUserShow Show.deleteOne result:`, result);
            })
            .catch((error) => {
                console.error(`deleteUserShow Show.deleteOne error:`, error);
            });
            
    })
    
    // remove the show from the user's list
    return UserModel.updateOne(
        {_id: userId}, 
        {$pull: {userShows: {showId: showId}}}
    );
    
};

/**
 * Sets the `hasWatched` value for a show for a given user.
 * 
 * @param {string} userId the user id
 * @param {string} showId the show id
 * @param {boolean} hasWatched a boolean value indicating whether the user has 
 * watched the show
 * @returns {*} a promise that resolves to the result of updating the user's 
 * show
 */
exports.setHasWatched = function(userId, showId, hasWatched) {
    
    return UserModel.updateOne(
        { _id: userId, "userShows.showId": showId }, 
        { $set: { "userShows.$.hasWatched": hasWatched } }
    );
    
};

/**
 * Sets the `favorite` value for a show for a given user.
 * 
 * @param {string} userId the user id
 * @param {string} showId the show id
 * @param {boolean} isFavorite a boolean value indicating whether the user has 
 * favorited the show
 * @returns {*} a promise that resolves to the result of updating the user's 
 * show
 */
exports.setIsFavorite = function(userId, showId, isFavorite) {
    
    return UserModel.updateOne(
        { _id: userId, "userShows.showId": showId }, 
        { $set: { "userShows.$.favorite": isFavorite } }
    );
    
};