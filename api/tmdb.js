const axios = require("axios").default;

// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
/**
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
 *
 * @typedef { "GET" | "POST" | "PUT" | "DELETE" } HTTPMethod
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

            // log all http requests
            // https://axios-http.com/docs/interceptors
            this.httpClient.interceptors.request.use((request) => {
                const date = new Date().toUTCString();
                const prefix = `[TMDB: ${date}]`;
                const fullURL = `${request?.baseURL ?? ""}${request?.url}`;
                const methodString = request?.method?.toUpperCase() ?? "GET";
                let message = `${prefix} ${methodString} to ${fullURL}`;
                const data = request?.data;
                if (data) {
                    const dataString = typeof data === "object" ?
                        JSON.stringify(data) :
                        data;
                    message += ` with body:\n${dataString}`;
                }
                console.log(message);

                return request;
            });

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
     * https://developers.themoviedb.org/3/tv/get-tv-content-ratings
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
            `/3/list/${listID}`,  // path
            options  // query params
        );
    }

    /**
     * Create a list for the user.
     *
     * A session id is required, which can be retrieved from
     * `TMDB.createSession`.
     *
     * https://developers.themoviedb.org/3/lists/create-list
     *
     * For example:
     * ```
     * tmdb.createList(sessionID, {
     *     name: "programmatically created list",
     *     description: "The description for my new list.",
     *     language: "en"
     * })
     * .then((result) => {
     *     console.log(result);
     * })
     * .catch((error) => {
     *     console.error(error);
     * });
     * ```
     *
     * @param {string} sessionID the session id
     * @param {CreateListBody} body the options for creating the list
     * @returns {Promise<CreateListResponse>} the response from creating the list
     */
    async createList(sessionID, body) {
        return await this._apiRequest(
            "POST",
            "/3/list",
            { session_id: sessionID },
            body
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
     */
    async updateList(listID, accessToken, options) {
        return await this._apiRequest(
            "PUT",
            `/4/list/${listID}`,
            null,  // query params
            options,
            {
                "Authorization": `Bearer ${accessToken}`
            }
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
     * A session id is required, which can be retrieved from
     * `TMDB.createSession`.
     *
     * https://developers.themoviedb.org/3/lists/delete-list
     *
     * Appears to return an error response even if the list has been
     * successfully deleted.
     *
     * @param {string | number} listID the list id
     * @param {string} sessionID the session id
     * @returns {Promise<TMDBGeneralResponse>} whether or not the list was
     * successfully deleted
     */
    async deleteList(listID, sessionID) {
        return await this._apiRequest(
            "DELETE",
            `/3/list/${listID}`,
            { session_id: sessionID }
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
     * @param {ModifyListRequest} items the items to add to the list
     */
    async addItemsToList(listID, accessToken, items) {
        return await this._apiRequest(
            "POST",
            `/4/list/${listID}/items`,
            null,
            items,
            {
                "Authorization": `Bearer ${accessToken}`
            }
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
     * @param {ModifyListRequest} items the items to remove from the list
     */
    async removeItemsFromList(listID, accessToken, items) {
        return await this._apiRequest(
            "DELETE",
            `/4/list/${listID}/items`,
            null,
            items,
            {
                "Authorization": `Bearer ${accessToken}`
            }
        );
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

}
