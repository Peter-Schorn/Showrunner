const ShowModel = require("./ShowModel");
const { TMDB } = require("../api");
const { retrieveAllShowIds, addShowToDatabase } = require("./updateShowModel");

const tmdb = new TMDB(process.env.TMDB_API_KEY_V4);


/**
 * Uses the /tv/changes endpoint to check for changes to shows in the TMDB api
 * and updates the `shows` collection in mongodb.
 *
 * https://developers.themoviedb.org/3/changes/get-tv-change-list
 */
module.exports = function refreshShowModel() {

    console.log("refreshShowModel");

    retrieveAllShowIds()
        .then((showIds) => {

            tmdb.allTVShowChangesAllPages((page, error) => {

                if (error) {
                    console.error("refreshShowModel: error:", error);
                    return;
                }
                if (!page) {
                    console.error("refreshShowModel: no page");
                    return;
                }
                
                for (const changedShow of page.results) {
                    if (showIds.has(changedShow.id)) {

                        console.log(`will refresh show ${changedShow.id}`);

                        // will update the show if it is already in the database
                        addShowToDatabase(changedShow.id)
                            .then((result) => {
                                console.log(
                                    `result of adding ${changedShow.id}:`, 
                                    result
                                );
                            })
                            .catch((error) => {
                                console.error(
                                    "refreshShowModel: error:", error
                                );
                            });

                    }



                }


            });


        })
        .catch((error) => {
            console.error("refreshShowModel: error:", error);
        });

};