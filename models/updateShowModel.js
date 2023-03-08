const mongoose = require("mongoose");
const ShowModel = require("./ShowModel");
const UserModel = require("./UserModel");
const { TMDB } = require("../api");

const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

/**
 * Adds a show to the database.
 * 
 * @param {number} showId 
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
            })
            
        })
        .catch((error) => {
            console.error("addShowToDataBase:", error);
            throw error;
        });
        
}

/**
 * Retrieve a show from the database or from the TMDB api.
 * 
 * If the show was not already in the database, then it will be added.
 * 
 * @param {number} showId 
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
    
}

/**
 * Retrieves the full show objects for a given user
 * 
 * @param {string} userId the user id
 * @returns {*} a promise that resolves to an array of show objects
 */
exports.userFullShows = function(userId) {
    
    // TODO: fallback on TMDB api when shows not in database
    
    return UserModel.findById(userId)
        .then((user) => {
            const showIds = (user?.userShows ?? []).map((show) => show.showId);
            return ShowModel.find({ "showId": { $in: showIds } })
                .then((shows) => {
                    
                    if (!shows) {
                        return []
                    }
                    return shows;
                })
            
        })
        
}