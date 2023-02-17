const axios = require("axios").default;

// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

/**
 * @typedef { import("./types").HTTPMethod } HTTPMethod
 * @typedef { import("./types").TVShowDetails } TVShowDetails
 * @typedef { import("./types").TVShowAccountStates } TVShowAccountStates
 * @typedef { import("./types").UserList } UserList
 * @typedef { import("./types").ListSortBy } ListSortBy
 * @typedef { import("./types").TVShowAlternativeTitles } TVShowAlternativeTitles
 * @typedef { import("./types").TVShowChanges } TVShowChanges
 * @typedef { import("./types").TVShowContentRatings } TVShowContentRatings
 * @typedef { import("./types").TVShowImages } TVShowImages
 * @typedef { import("./types").TVShowRecommendations } TVShowRecommendations
 * @typedef { import("./types").TVShowReviews } TVShowReviews
 * @typedef { import("./types").SimilarTVShows } SimilarTVShows
 * @typedef { import("./types").WatchProviders } WatchProviders
 * @typedef { import("./types").RequestTokenInfoV4 } RequestTokenInfoV4
 * @typedef { import("./types").AccessTokenInfoV4 } AccessTokenInfoV4
 * @typedef { import("./types").SessionResponse } SessionResponse
 * @typedef { import("./types").TMDBGeneralResponse } TMDBGeneralResponse
 * @typedef { import("./types").CreateListBody } CreateListBody
 * @typedef { import("./types").CreateListResponse } CreateListResponse
 * @typedef { import("./types").TVSearchOptions } TVSearchOptions
 * @typedef { import("./types").TVShowsResponse } TVShowsResponse
 * @typedef { import("./types").UpdateListRequest } UpdateListRequest
 * @typedef { import("./types").ModifyListRequest } ModifyListRequest
 * @typedef { import("./types").AccountDetails } AccountDetails
 * @typedef { import("./types").AccountLists } AccountLists
 * @typedef { import("./types").AccountListsOptions } AccountListsOptions
 * @typedef { import("./types").TMDBConfigurationDetails } TMDBConfigurationDetails
 * @typedef { import("./types").ClearListResponse } ClearListResponse
 * @typedef { import("./types").ModifyListItemsResponse } ModifyListItemsResponse
 */

/**
 * A class that provides access to the TMDB API.
 *
 * https://developers.themoviedb.org/3/getting-started/introduction
 */
exports.default = class TMDB {

    static apiBase = "https://api.themoviedb.org";

    /**
     * Creates an instance of TMDB.
     *
     * @param {string} apiKey the API key
     * @param {boolean} enableLogging whether or not to log the http requests
     * to the TMDB api; default: true
     */
    constructor(apiKey, enableLogging=true) {

        if (!apiKey) {
            throw new Error(`apiKey cannot be '${apiKey}'`);
        }
        this.apiKey = apiKey;
        this.httpClient = axios.create();

        if (enableLogging) {
            this.configureLogging();
        }

    }

    // MARK: - Endpoints -


    // MARK: TV Shows

    /**
     * Get the primary information about a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-details
     *
     * Example:
     *
     * ```
     * // https://www.themoviedb.org/tv/1396-breaking-bad
     * const breakingBadTVShowID = 1396;
     *
     * tmdb.tvShowDetails(breakingBadTVShowID)
     *     .then((show) => {
     *         console.log(
     *             `tmdb.tvShowDetails callback: show.name: "${show.name}"`
     *         );
     *     })
     *     .catch((error) => {
     *         console.error("error from TMDB:", error);
     *     });
     * ```
     *
     * @param {string |  number} id the tv show id
     * @param {string | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowDetails>} the details of a TMDB tv show
     */
    async tvShowDetails(id, language) {
        return await this._get(
            `/3/tv/${id}`,  // path
            { language }  // query params
        );
    }

    /**
     * Get a list of the current popular TV shows on TMDB. This list updates daily.
     *
     * https://developers.themoviedb.org/3/tv/get-popular-tv-shows
     *
     * Example:
     * ```
     * tmdb.tvShowPopular({ page: 2 })
     *     .then((result) => {
     *         console.log(result);
     *     })
     *     .catch((error) => {
     *         console.error(error);
     *     });
     * ```
     *
     * @param {{
     *     page?: number | null | undefined,
     *     language?: string | null | undefined
     * }} [options] the options: page: the page to return (default: 1);
     * language: an ISO 63901 language code
     * @returns {Promise<TVShowsResponse>} an object containing a list of the
     * most popular tv shows
     */
    async tvShowPopular(options) {
        return await this._get(
            "/3/tv/popular",
            options
        );
    }

    /**
     * Get a list of the top rated TV shows on TMDB.
     *
     * https://developers.themoviedb.org/3/tv/get-top-rated-tv
     *
     * Example:
     * ```
     * tmdb.tvShowTopRated({ language: "es" })  // spanish
     *     .then((result) => {
     *         console.log(result);
     *     })
     *     .catch((error) => {
     *         console.error(error);
     *     });
     * ```
     *
     * @param {{
    *     page?: number | null | undefined,
    *     language?: string | null | undefined
    * }} [options] the options: page: the page to return (default: 1);
    * language: an ISO 63901 language code
    * @returns {Promise<TVShowsResponse>} an object containing a list of the
    * most top rated tv shows
    */
    async tvShowTopRated(options) {
        return await this._get(
            "/3/tv/top_rated",
            options
        );
    }

    /**
     * Get the rating for a tv show, as well as whether or not it belongs on
     * your favorites and/or watchlist.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-account-states
     *
     * @param {string | number} id the tv show id
     * @param {{
     *     language?: string | null | undefined,
     *     session_id?: string | null | undefined,
     *     guest_session_id?: string | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *   language: an ISO 639-1 language code;
     *   session_id: the session id;
     *   guest_session_id: the guest session id
     * @returns {Promise<TVShowAccountStates>} the information for the tv show
     */
    async tvShowAccountStates(id, options) {
        return await this._get(
            `/3/tv/${id}/account_states`,  // path
            options  // query params
        );
    }

    /**
     * Get the alternative titles for a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-alternative-titles
     *
     * @param {string | number} id the tv show id
     * @param {string | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowAlternativeTitles>} the alternative titles for a tv show
     */
    async tvShowAlternativeTitles(id, language) {
        return await this._get(
            `/3/tv/${id}/alternative_titles`,  // path
            { language }  // query params
        );
    }

    /**
     * Get the changes for a tv show. By default only the last 24 hours are
     * returned.
     *
     * You can query up to 14 days in a single query by using the start_date
     * and end_date query parameters.
     *
     * TV show changes are different than movie changes in that there are some
     * edits on seasons and episodes that will create a change entry at the show
     * level. These can be found under the season and episode keys. These keys
     * will contain a `series_id` and `episode_id`. You can use the season
     * changes and episode changes methods to look these up individually.
     *
     *
     * https://developers.themoviedb.org/3/tv/get-tv-changes
     *
     * @param {string | number} id the tv show id
     * @param {{
     *     start_date?: string | null | undefined,
     *     end_date?: string | null | undefined,
     *     page?: number | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *   language: an ISO 639-1 language code;
     *   session_id: the session id;
     *   guest_session_id: the guest session id
     * @returns {Promise<TVShowChanges>} the tv show changes
     */
    async tvShowChanges(id, options) {
        return await this._get(
            `/3/tv/${id}/changes`,  // path
            options  // query params
        );
    }

    /**
     * Get the list of content ratings (certifications) that have been added to
     * a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-content-ratings
     *
     * @param {string | number} id the tv show id
     * @param {string | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowContentRatings>} the content ratings for the tv
     * show in various languages
     */
    async tvShowContentRatings(id, language) {
        return await this._get(
            `/3/tv/${id}/content_ratings`,  // path
            { language }  // query params
        );
    }

    /**
     * Get the list of content ratings (certifications) that have been added to
     * a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-external-ids
     *
     * @param {string | number} id the tv show id
     * @param {string | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowContentRatings>} the content ratings for the tv
     * show in various languages
     */
    async tvShowExternalIDs(id, language) {
        return await this._get(
            `/3/tv/${id}/external_ids`,  // path
            { language }  // query params
        );
    }

    /**
     * Get the images that belong to a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-images
     *
     * @param {string | number} id the tv show id
     * @param {string | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowImages>} the images for the tv show
     */
    async tvShowImages(id, language) {
        return await this._get(
            `/3/tv/${id}/images`,  // path
            { language }  // query params
        );
    }

    /**
     * Get the list of recommendations for a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-recommendations
     *
     * See also `TMDB.tvShowSimilarShows(id, options)`.
     *
     * @param {string | number} id the tv show id
     * @param {{
     *     language?: string | null | undefined,
     *     page?: number | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *   language: an ISO 639-1 language code;
     *   page: the index of the page to return;
     * @returns {Promise<TVShowRecommendations>} the recommendations for the tv
     * show
     */
    async tvShowRecommendations(id, options) {
        return await this._get(
            `/3/tv/${id}/recommendations`,  // path
            options  // query params
        );
    }

    /**
     * Get the similar shows for a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-similar-tv-shows
     *
     * See also `TMDB.tvShowRecommendations(id, options)`.
     *
     * @param {string | number} id the tv show id
     * @param {{
     *     language?: string | null | undefined,
     *     page?: number | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *   language: an ISO 639-1 language code;
     *   page: the index of the page to return;
     * @returns {Promise<SimilarTVShows>} similar tv shows
     */
    async tvShowSimilarShows(id, options) {
        return await this._get(
            `/3/tv/${id}/similar`,  // path
            options  // query params
        );
    }

    /**
     * Get the reviews for a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-reviews
     *
     * @param {string | number} id the tv show id
     * @param {{
     *     language?: string | null | undefined,
     *     page?: number | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *   language: an ISO 639-1 language code;
     *   page: the index of the page to return;
     * @returns {Promise<TVShowReviews>} the recommendations for the tv show
     */
    async tvShowReviews(id, options) {
        return await this._get(
            `/3/tv/${id}/reviews`,  // path
            options  // query params
        );
    }

    /**
     * Get the watch providers (Netflix, Hulu) for a tv show.
     *
     * Powered by our partnership with JustWatch, you can query this method to
     * get a list of the availabilities per country by provider.
     *
     * This is not going to return full deep links, but rather, it's just enough
     * information to display what's available where.
     *
     * You can link to the provided TMDB URL to help support TMDB and provide
     * the actual deep links to the content.
     *
     * Please note: In order to use this data you must attribute the source of
     * the data as JustWatch. If we find any usage not complying with these
     * terms we will revoke access to the API.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-watch-providers
     *
     * @param {string | number} id the tv show id
     * @returns {Promise<WatchProviders>} the watch providers for the tv show
     */
    async tvShowWatchProviders(id) {
        return await this._get(
            `/3/tv/${id}/watch/providers`  // path
        );
    }


    /**
     * Rate a tv show.
     *
     * A session id is required, which can be retrieved from
     * `TMDB.createSession`.
     *
     * https://developers.themoviedb.org/3/tv/rate-tv-show
     *
     * @param {string | number} id the id of the tv show
     * @param {number} rating the rating (must be in the range [0.5, 10])
     * @returns {Promise<TMDBGeneralResponse>} a response indicating whether or
     * not the request succeeded
     */
    async rateTVShow(id, rating, sessionID) {
        return this._apiRequest(
            "POST",
            `/3/tv/${id}/rating`,
            { session_id: sessionID },
            { value: rating }
        );
    }

    // MARK: Search

    /**
     * Search for tv shows.
     *
     * https://developers.themoviedb.org/3/search/search-tv-shows
     *
     * Example:
     *
     * ```
     * tmdb.searchTVShows({ query: "Wire The", include_adult: true })
     *     .then((result) => {
     *         console.log(`name of first show: "${result.results[0].name}"`);
     *     })
     *     .catch((error) => {
     *         console.error(error);
     *     });
     * ```
     *
     * @param {TVSearchOptions} options the options for the search: `query`,
     * `page`, `language`, `include_adult`, and `first_air_date_year`
     *
     * @returns {Promise<TVShowsResponse>} an object containing the tv shows
     * that match the query
     */
    async searchTVShows(options) {
        return await this._get("/3/search/tv", options);
    }

    // MARK: Account

    /**
     * Get the details of a user account.
     *
     * A session id is required, which can be retrieved from
     * `TMDB.createSession`.
     *
     * https://developers.themoviedb.org/3/account/get-account-details
     *
     * @param {string} sessionID the session id
     * @returns {Promise<AccountDetails>} the account details
     */
    async accountDetails(sessionID) {
        return await this._get(
            "/3/account",
            { session_id: sessionID }
        );
    }

    /**
     * Get all of the lists created by an account. Will include private lists if
     * you are the owner.
     *
     * A session id is required, which can be retrieved from
     * `TMDB.createSession`.
     *
     * https://developers.themoviedb.org/3/account/get-created-lists
     *
     * @param {string} accountID the account id, which can be retrieved from
     * `TMDB.accountDetails`
     * @param {AccountListsOptions} [options] the options: language: an ISO
     * 639-1 language
     * @returns {Promise<AccountLists>}
     */
    async accountLists(accountID, options) {
        return await this._get(
            `/4/account/${accountID}/lists`,
            options
        );
    }

    // async accountWatchlist

    // MARK: Lists

    /**
     * Gets a user's list by id. Private lists can only be accessed by their
     * owners.
     *
     * https://developers.themoviedb.org/3/lists/get-list-details
     *
     * @param {string | number } listID the list id
     * @param {{
     *     page?:  number | null | undefined,
     *     sortBy?: ListSortBy | null | undefined,
     *     language?: string | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *  page: the page of results to retrieve;
     *  sortBy: how to sort the list;
     *  language: the language for the list
     * @returns {Promise<UserList>} a movie or tv show list
     */
    async getList(listID, options) {
        return await this._get(
            `/4/list/${listID}`,  // path
            options  // query params
        );
    }

    /**
     * Create a list for the user.
     *
     * Requires a user access token, which can be retrieved from
     * `TMDB.createAccessToken`.
     *
     * https://developers.themoviedb.org/3/lists/create-list
     *
     * For example:
     * ```
     * tmdb.createList(accessToken, {
     *     name: "programmatically created list",
     *     description: "The description for my new list."
     * })
     * .then((result) => {
     *     console.log(result);
     * })
     * .catch((error) => {
     *     console.error(error);
     * });
     * ```
     *
     * @param {string} accessToken the access token
     * @param {CreateListBody} body the options for creating the list
     * @returns {Promise<CreateListResponse>} the response from creating the list
     */
    async createList(accessToken, body) {
        if (!body.iso_639_1) {
            // this field is required; the api will return an error if it is
            // omitted, so use english as a default
            body.iso_639_1 = "en";
        }
        return await this._apiRequest(
            "POST",
            "/4/list",
            null,
            body,
            TMDB._authorizationHeaderFromAccessToken(accessToken)
        );
    }

    /**
     * Update the details of a list.
     *
     * Requires a user access token, which can be retrieved from
     * `TMDB.createAccessToken`.
     *
     * https://developers.themoviedb.org/4/list/update-list
     *
     * @param {string | number} listID the id of the list to update
     * @param {string} accessToken the user access token
     * @param {UpdateListRequest} options the options for updating the list
     * @returns {Promise<TMDBGeneralResponse>} an object that indicates whether
     * or not the list was updated successfully
     */
    async updateList(listID, accessToken, options) {
        return await this._apiRequest(
            "PUT",
            `/4/list/${listID}`,
            null,  // query params
            options,
            TMDB._authorizationHeaderFromAccessToken(accessToken)
        );
    }

    /**
     * Clear all of the items from a list.
     *
     * A session id is required, which can be retrieved from
     * `TMDB.createSession`.
     *
     * https://developers.themoviedb.org/3/lists/clear-list
     *
     * @param {string | number} listID the list id
     * @param {string} sessionID the session id
     * @returns {Promise<ClearListResponse>} an object that indicates whether or
     * not the list was cleared and how many items were removed
     */
    async clearList(listID, sessionID) {
        return await this._apiRequest(
            "POST",
            `/3/list/${listID}/clear`,
            {
                session_id: sessionID,
                confirm: true
            }
        );
    }

    /**
     * Delete a list.
     *
     * Requires a user access token, which can be retrieved from
     * `TMDB.createAccessToken`.
     *
     * https://developers.themoviedb.org/3/lists/delete-list
     *
     * Appears to return an error response even if the list has been
     * successfully deleted.
     *
     * @param {string | number} listID the list id
     * @param {string} accessToken the user access token
     * @returns {Promise<TMDBGeneralResponse>} an object that indicates whether
     * or not the list was successfully deleted
     */
    async deleteList(listID, accessToken) {
        return await this._apiRequest(
            "DELETE",
            `/4/list/${listID}`,
            null,
            null,
            // headers:
            TMDB._authorizationHeaderFromAccessToken(accessToken)
        );
    }

    /**
     * Add items to a list.
     *
     * Requires a user access token, which can be retrieved from
     * `TMDB.createAccessToken`.
     *
     * https://developers.themoviedb.org/4/list/add-items
     *
     * For example:
     * ```
     * tmdb.addItemsToList(myListID, accessToken, {
     *     items: [
     *         {
     *             "media_type": "tv",
     *             "media_id": theWireID
     *         },
     *         {
     *             "media_type": "movie",
     *             "media_id": inceptionMovieID
     *         }
     *     ]
     * })
     * .then((result) => {
     *     console.log(result);
     * })
     * .catch((error) => {
     *     console.error(error);
     * });
     * ```
     *
     * @param {string | number} listID the id of the list to add items to
     * @param {string} accessToken the user access token
     * @param {ModifyListRequest} items the items to add to the list
     * @returns {Promise<ModifyListItemsResponse>} an object that indicates
     * whether or not the items were added successfully and which items were
     * added
     */
    async addItemsToList(listID, accessToken, items) {
        return await this._apiRequest(
            "POST",
            `/4/list/${listID}/items`,
            null,
            items,
            TMDB._authorizationHeaderFromAccessToken(accessToken)
        );
    }

    /**
     * Remove items from a list.
     *
     * Requires a user access token, which can be retrieved from
     * `TMDB.createAccessToken`.
     *
     * https://developers.themoviedb.org/4/list/remove-items
     *
     * For example:
     * ```
     * tmdb.removeItemsFromList(myListID, accessToken, {
     *     items: [
     *         {
     *             "media_type": "tv",
     *             "media_id": theWireID
     *         },
     *         {
     *             "media_type": "movie",
     *             "media_id": inceptionMovieID
     *         }
     *     ]
     * })
     * .then((result) => {
     *     console.log(result);
     * })
     * .catch((error) => {
     *     console.error(error);
     * });
     * ```
     *
     * @param {string | number} listID the id of the list to remove items from
     * @param {string} accessToken the user access token
     * @param {ModifyListRequest} items the items to remove from the list
     * @returns {Promise<ModifyListItemsResponse>} an object that indicates
     * whether or not the items were removed successfully and which items were
     * removed
     */
    async removeItemsFromList(listID, accessToken, items) {
        return await this._apiRequest(
            "DELETE",
            `/4/list/${listID}/items`,
            null,
            items,
            TMDB._authorizationHeaderFromAccessToken(accessToken)
        );
    }

    // MARK: Configuration

    /**
     * Get the system wide configuration information.
     *
     * https://developers.themoviedb.org/3/configuration/get-api-configuration
     *
     * Some elements of the API require some knowledge of this configuration
     * data. The purpose of this is to try and keep the actual API responses as
     * light as possible. It is recommended you cache this data within your
     * application and check for updates every few days.
     *
     * This method currently holds the data relevant to building image URLs as
     * well as the change key map.
     *
     * To build an image URL, you will need 3 pieces of data. The `base_url`,
     * `size` and `file_path`. Simply combine them all and you will have a fully
     * qualified URL. Here’s an example URL:
     * ```
     * "https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg"
     * ```
     * The configuration method also contains the list of change keys which can
     * be useful if you are building an app that consumes data from the change
     * feed.
     *
     * Sample response:
     * ```
     * {
     *   images: {
     *     base_url: 'http://image.tmdb.org/t/p/',
     *     secure_base_url: 'https://image.tmdb.org/t/p/',
     *     backdrop_sizes: [ 'w300', 'w780', 'w1280', 'original' ],
     *     logo_sizes: [ 'w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original' ],
     *     poster_sizes: [ 'w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original' ],
     *     profile_sizes: [ 'w45', 'w185', 'h632', 'original' ],
     *     still_sizes: [ 'w92', 'w185', 'w300', 'original' ]
     *   },
     *   change_keys: [
     *     'adult',                'air_date',         'also_known_as',
     *     'alternative_titles',   'biography',        'birthday',
     *     'budget',               'cast',             'certifications',
     *     'character_names',      'created_by',       'crew',
     *     'deathday',             'episode',          'episode_number',
     *     'episode_run_time',     'freebase_id',      'freebase_mid',
     *     'general',              'genres',           'guest_stars',
     *     'homepage',             'images',           'imdb_id',
     *     'languages',            'name',             'network',
     *     'origin_country',       'original_name',    'original_title',
     *     'overview',             'parts',            'place_of_birth',
     *     'plot_keywords',        'production_code',  'production_companies',
     *     'production_countries', 'releases',         'revenue',
     *     'runtime',              'season',           'season_number',
     *     'season_regular',       'spoken_languages', 'status',
     *     'tagline',              'title',            'translations',
     *     'tvdb_id',              'tvrage_id',        'type',
     *     'video',                'videos'
     *   ]
     * }
     * ```
     *
     * @returns {Promise<TMDBConfigurationDetails>} the configuration details;
     * see sample response
     */
    async configurationDetails() {
        return await this._get("/3/configuration");
    }

    // MARK: User Authentication

    /**
     * Creates the request token, the first step in the authorization process.
     *
     * https://developers.themoviedb.org/4/auth/create-request-token
     *
     * You can think of a request token as a temporary token that is waiting for
     * the TMDb user to authorize on your behalf. It serves no other purpose and
     * cannot be used for authenticating requests. Unused request tokens will
     * automatically expire after 15 minutes.
     *
     * In order for a user to approve your request token, you'll want to direct
     * the user to the website:
     *
     * `https://www.themoviedb.org/auth/access?request_token={request_token}`
     *
     * Once a user has approved your request, they'll either be directed to the
     * /auth/access/approve page on TMDb or redirected to the `callbackURL` you
     * specified in this method.
     *
     * Next, call `TMDB.createAccessToken(requestToken)` with the approved
     * refresh token to get the access token.
     *
     * @param {string | null | undefined} [callbackURL] the URL to redirect to
     * after the user approves the request
     * @returns {Promise<RequestTokenInfoV4>} the request token, along with
     * other metadata
     */
    async createRequestToken(callbackURL) {
        return await this._apiRequest(
            "POST",
            "/4/auth/request_token",
            null,  // query params
            {
                "redirect_to": callbackURL
            }  // body
        );
    }

    /**
     * Creates the access token, the second step in the authorization flow.
     *
     * This method will finish the user authentication flow and issue an
     * official user access token. The next step is to create a session using
     * `TMDB.createSession(accessToken)`.
     *
     * https://developers.themoviedb.org/4/auth/create-access-token
     *
     * @param {string} requestToken the refresh token, which **must have been
     * approved by the user**
     * @returns {Promise<AccessTokenInfoV4>} the access token, along with
     * other metadata
     */
    async createAccessToken(requestToken) {
        return await this._apiRequest(
            "POST",
            "/4/auth/access_token",
            {
                "request_token": requestToken
            }
        );
    }

    /**
     * Creates a session from an access token, the final step in the
     * authorization process.
     *
     * https://developers.themoviedb.org/3/authentication/create-session-from-v4-access-token
     *
     * @param {string} accessToken the access token
     * @returns {Promise<SessionResponse>} the session info
     */
    async createSession(accessToken) {
        return await this._apiRequest(
            "POST",
            "/3/authentication/session/convert/4",
            {
                "access_token": accessToken
            }
        );
    }

    // MARK: HTTP Request Methods

    /**
     * Makes a GET request to the TMDB API.
     *
     * @param {string} path the path of the endpoint, which will be appended to
     * `TMDB.apiBase`.
     * @param {Object | null | undefined} [queryParams] the query parameters for
     * the endpoint
     * @returns {Promise<any>} the response body from the server
     */
    async _get(path, queryParams) {
        return await this._apiRequest("GET", path, queryParams);
    }

    /**
     * Makes an HTTP request to the TMDB API.
     *
     * @param {HTTPMethod} method the http method
     * @param {string} path the path of the endpoint, which will be appended to
     * `TMDB.apiBase`.
     * @param {Object | null | undefined} [queryParams] the query parameters for the endpoint
     * @param {Object | null | undefined} [body] the body of the request
     * @param {Object<string, string | null | undefined> | null | undefined} [headers] additional headers to use,
     * which, if present, will overwrite any default headers
     * @returns {Promise<any>} the response body from the server
     */
    async _apiRequest(method, path, queryParams, body, headers) {

        try {

            let fullHeaders = {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json;charset=utf-8"
            }

            if (typeof headers === "object") {
                // Allow the passed in headers to overwrite the default headers
                // above, not the other way around. Keys already present in
                // `headers` will NOT have their values overwritten by the
                // values of the same keys in `fullHeaders`.
                fullHeaders = Object.assign(fullHeaders, headers);
            }

            // https://axios-http.com/docs/req_config
            const response = await this.httpClient.request({
                method: method,
                baseURL: TMDB.apiBase,
                url: path,
                headers: fullHeaders,
                // "params that are null or undefined are not rendered in the URL."
                params: queryParams,
                // the body is omitted if it is null or undefined
                data: body
            });

            return response.data;

        } catch (error) {
            throw error?.response?.data ?? error;
        }

    }

    // MARK: Other

    configureLogging() {
        // log all http requests
        // https://axios-http.com/docs/interceptors
        this.httpClient.interceptors.request.use((request) => {
            const date = new Date().toUTCString();
            const prefix = `[TMDB: ${date}]`;
            const fullURL = `${request?.baseURL ?? ""}${request?.url}`;
            const methodString = request?.method?.toUpperCase() ?? "GET";
            const headersString = request?.headers;
            let message = `${prefix} ${methodString} to ${fullURL}` +
                `with headers:\n${headersString}\n`;
            const data = request?.data;
            if (data) {
                const dataString = typeof data === "object" ?
                    JSON.stringify(data) :
                    data;
                message += `with body:\n${dataString}`;
            }
            console.log(message);

            return request;
        });
    }

    /**
     * Creates the authorization header from the user access token.
     *
     * @param {string} accessToken the access token
     * @returns {Object<string, string | null | undefined>} the authorization
     * header
     */
    static _authorizationHeaderFromAccessToken(accessToken) {
        return {
            "Authorization": `Bearer ${accessToken}`
        };
    }


}
