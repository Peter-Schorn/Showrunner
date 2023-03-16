const mongoose = require("mongoose");
const { toCamelCase } = require("camel-case-converter");

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
exports.addShowToDatabase = function (showId) {

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
                lastEpisodeToAir: toCamelCase(tvShowDetails.last_episode_to_air),
                nextEpisodeToAir: toCamelCase(tvShowDetails.next_episode_to_air),
                genres: tvShowDetails.genres,
                networks: toCamelCase(tvShowDetails.networks),
                episodeCount: tvShowDetails.number_of_episodes,
                seasonCount: tvShowDetails.number_of_seasons,
                overview: tvShowDetails.overview,
                popularity: tvShowDetails.popularity,
                seasons: toCamelCase(tvShowDetails.seasons),
                status: tvShowDetails.status,
                tagline: tvShowDetails.tagline,
                voteAverage: tvShowDetails.vote_average,
                voteCount: tvShowDetails.vote_count,
                watchProviders: toCamelCase(tvShowDetails.watch_providers.results)
            }, {
                // insert the document if it does not exist; else, update the
                // document
                upsert: true,
                // return the document after it has been updated
                returnDocument: "after"

            })
            .lean()
            .exec();

        })
        .catch((error) => {
            console.error("addShowToDataBase:", error);
            throw error;
        });

};

/**
 * Adds a show to a user's list. Also adds the full show object to the shows
 * collection.
 *
 * @param {string} userId the user id
 * @param {number} showId the show id
 * @returns {Promise<any>} a promise that resolves to the result of adding
 * the show to the user's list
 */
exports.addShowToUserList = function (userId, showId) {

    exports.addShowToDatabase(showId);

    const show = { showId };

    // https://stackoverflow.com/a/14528282/12394554
    return UserModel.updateOne(
        { _id: userId, "userShows.showId": { $ne: showId } },
        { $push: { userShows: show } },
        { runValidators: true }
    )
    .exec();

};

/**
 * Retrieve a full show object with the user show object inside it from the
 * database or from the TMDB api.
 *
 * If the show was not already in the database, then it will be added.
 *
 * @param {string} userId the user id
 * @param {number} showId the show id
 * @returns {*} a promise that resolves to a show object with the user show
 * object inside it
 */
exports.retrieveShow = function (userId, showId) {

    // search for the show in the database; if it is not found, then retrieve
    // it from the TMDB api and add it back to the database
    const findShow = ShowModel.findOne({ showId })
        .lean()
        .exec()
        .then((show) => {
            if (show) {
                return show;
            }
            else {
                // returns the full show object that was added to the database
                return exports.addShowToDatabase(showId);
            }
        });

    const findUser = UserModel.findById(userId);

    return Promise.all([
        findUser,
        findShow
    ])
    .then(([user, show]) => {

        if (!show) {
            throw new Error(
                `could not find show ${showId} in database or in tmdb api`
            );
        }

        const userShow = user?.userShows.find((userShow) => {
            return userShow.showId.toString() === show.showId.toString();
        });

        if (userShow) {
            show.userShow = userShow;
        }

        return show;

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
exports.userFullShows = function (userId) {

    return UserModel.findById(userId)
        .then((user) => {

            // an array of all of the user's show ids
            const showIds = (user?.userShows ?? []).map((show) => `${show?.showId}`);

            return ShowModel.find({ "showId": { $in: showIds } })
                .lean()
                .exec()
                .then((showObjects) => {

                    // the show ids for which the corresponding full show
                    // objects exist in the shows collection
                    const foundIds = new Set(showObjects.map(show => `${show?.showId}`));

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

                            fullShowObjects.sort((lhs, rhs) => {
                                if (lhs.showName < rhs.showName) {
                                    return -1;
                                }
                                if (lhs.showName > rhs.showName) {
                                    return 1;
                                }
                                return 0;
                            });

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
exports.deleteUserShow = function (userId, showId) {

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
            ShowModel.deleteOne({ showId })
                .exec()
                .then((result) => {
                    console.log(`deleteUserShow Show.deleteOne result:`, result);
                })
                .catch((error) => {
                    console.error(`deleteUserShow Show.deleteOne error:`, error);
                });

        });

    // remove the show from the user's list
    return UserModel.updateOne(
        { _id: userId },
        { $pull: { userShows: { showId: showId } } }
    )
    .exec();

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
exports.setHasWatched = function (userId, showId, hasWatched) {

    return UserModel.updateOne(
        { _id: userId, "userShows.showId": showId },
        { $set: { "userShows.$.hasWatched": hasWatched } }
    )
    .exec();

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
exports.setIsFavorite = function (userId, showId, isFavorite) {

    return UserModel.updateOne(
        { _id: userId, "userShows.showId": showId },
        { $set: { "userShows.$.favorite": isFavorite } }
    )
    .exec();

};

/**
 * Retrieves all of the show ids from the shows collection.
 *
 * @returns {Promise<Set<number>>} a promise that resolves to a set of all the
 * show ids
 */
exports.retrieveAllShowIds = function () {

    return ShowModel.find(
        {},
        "showId"
    )
    .exec()
    .then((showIds) => {
        return new Set(showIds.map(showId => showId.showId));
    });

};
