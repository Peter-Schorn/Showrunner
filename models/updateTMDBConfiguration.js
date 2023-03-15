const { TMDBConfiguration } = require("./TMDBConfiguration");
const { TMDB } = require("../api");

// this code is outside the function because we only want it to run once
const apiKey = process.env.TMDB_API_KEY_V4;
const tmdb = new TMDB(apiKey);

/**
 * Retrieves the TMDB API configuration from the /configuration endpoint
 * and saves it to the `configuration` collection in mongodb
 *
 * The configuration can be retrieved from the database as follows:
 * ```
 * TMDBConfiguration.findOne({})
 *     .then((configuration) => {
 *         console.log(configuration);
 *     })
 *     .catch((error) => {
 *         console.error(error);
 *     });
 * ```
 */
module.exports = function updateTMDBConfiguration() {
    // this function could be called multiple times (e.g., once every 24 hours)
    // we can define the function and export it at the same time

    console.log("updateTMDBConfiguration");

    tmdb.configurationDetails()
        .then((configuration) => {
            console.log("updateTMDBConfiguration: configuration:", configuration);

            // https://mongoosejs.com/docs/api/model.html#model_Model-replaceOne
            return TMDBConfiguration.replaceOne(
                {},  // filter
                configuration,
                {
                    // insert a new document if none are found  (in this case, if the collection is empty)
                    // upsert = update + insert
                    upsert: true,
                    // throw an error if the `configuration` object does not
                    // conform to the schema
                    runValidators: true
                }
            );
        })
        .then((result) => {
            console.log(
                "updateTMDBConfiguration: response from mongodb:", result
            );
        })
        .catch((error) => {
            console.error("updateTMDBConfiguration: error:", error);
        });

};
