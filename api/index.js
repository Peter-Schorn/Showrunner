require("dotenv").config();
const TMDB = require("./tmdb.js").default;

const apiKey = process.env.TMDB_API_KEY_V4;
if (!apiKey) {
    throw new Error(
        "couldn't get API key from environment " +
        "(expected key: 'TMDB_API_KEY_V4')"
    );
}

const tmdb = new TMDB(apiKey);

// https://www.themoviedb.org/tv/1396-breaking-bad
const breakingBadTVShowID = 1396;

// https://www.themoviedb.org/list/8238485
const petersShowsListID = 8238485;

// tmdb.tvShowDetails(breakingBadTVShowID).then((show) => {
//     console.log(`show.name: "${show.name}"`);
// });

// tmdb.getList(petersShowsListID).then((list) => {
//     console.log();
//     console.log(`list.name: "${list.name}"`);
//     console.log(`list.created_by: "${list.created_by}"`);
// });

// tmdb.tvShowAccountStates(petersShowsListID).then((accountStates) => {
//     console.log("received tv show account states:");
//     console.log(accountStates);
// })
// .catch((error) => {
//     // console.error("received error:", error.message);
//     // console.error("received error:", error.toJSON());
//     console.log("received error from tvShowAccountStates:")
//     console.log(error);
// });

// tmdb.tvShowImages(breakingBadTVShowID).then((images) => {
//     console.log("received images for tv show");
//     console.log(images.backdrops[0].file_path);
// });

tmdb.tvShowReviews(breakingBadTVShowID).then((results) => {
    console.log("\n--- received results ---\n");
    console.log(results);
});
