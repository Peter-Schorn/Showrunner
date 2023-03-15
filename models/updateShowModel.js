const mongoose = require("mongoose");
const ShowModel = require("./ShowModel");
const UserModel = require("./UserModel");
const { TMDB } = require("../api");

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

/**
 * Adds a show to the database. If a show with the same `showId` already exists
 * in the database, then it will be updated.
 * 
 * @param {number} showId the show id
 * @returns {*} a promise that resolves to the full show object that was added
 * to the database
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
                // insert the document if it does not exist; else, update the
                // document
                upsert: true,
                // return the document after it has been updated
                returnDocument: "after"
                
            })
            .lean();
            
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
 * Retrieves the full show objects for a given user, with the user show object
 * inside each full show object.
 * 
 * First checks database, then falls back on the TMDB api, and saves the 
 * returned data back into the database.
 * 
 * @param {string} userId the user id
 * @returns {*} a promise that resolves to an array of show objects
 */
exports.userFullShows = function(userId) {
    
    return UserModel.findById(userId)
        .then((user) => {
            
            // an array of all of the user's show ids
            const showIds = (user?.userShows ?? []).map((show) => show?.showId);
            
            return ShowModel.find({ "showId": { $in: showIds } })
                .lean()
                .then((showObjects) => {
                    
                    // the show ids for which the corresponding full show 
                    // objects exist in the shows collection
                    const foundIds = new Set(showObjects.map(show => show?.showId));
                    
                    // The show ids for which the corresponding full show 
                    // objects do NOT exist in the shows collection. We need
                    // to both add the full show object to the shows collection
                    // and retrieve it so that it can be returned by this 
                    // function.
                    const remainingIds = showIds.filter((id) => {
                        return !foundIds.has(id);
                    });
                    
                    // an array of promises, each of which add a show to the
                    // shows collection and resolve to the show that was added
                    const addToDatabasePromises = remainingIds.map((id) => {
                        // returns the full show object that was added
                        return exports.addShowToDatabase(id);
                    });
                    
                    console.log(
                        `addToDatabasePromises.length: ${addToDatabasePromises.length}`
                    );
                    
                    // execute all promises in parallel for performance
                    return Promise.all(addToDatabasePromises)
                        .then((missingShowObjects) => {
                            
                            // `missingShowObjects` are the full show objects
                            // that were not originally in the shows collection
                            
                            const fullShowObjects = showObjects.concat(
                                missingShowObjects
                            );
                            
                            for (let i = 0; i < fullShowObjects.length; i++) {
                                
                                const show = fullShowObjects[i];
                                
                                // find the user show object that corresponds to
                                // the full show object
                                const userShow = user.userShows.find((userShow) => {
                                    return userShow.showId.toString() === show.showId.toString();
                                });
                                
                                if (userShow) {
                                    // attach the user show object to the full
                                    // show object
                                    fullShowObjects[i].userShow = userShow;
                                }
                                
                            }
                            
                            return fullShowObjects;
                            
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
            
    });
    
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

/**
 * Retrieves all of the show ids from the shows collection.
 * 
 * @returns {Promise<Set<number>>} a promise that resolves to a set of all the 
 * show ids
 */
exports.retrieveAllShowIds = function() {
   
    return ShowModel.find(
        {},
        "showId"    
    )
    .then((showIds) => {
        return new Set(showIds.map(showId => showId.showId));
    });

};