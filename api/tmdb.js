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
     */
    constructor(apiKey) {

        if (!apiKey) {
            throw new Error(`apiKey cannot be '${apiKey}'`);
        }
        this.apiKey = apiKey;
        this.httpClient = axios.create();

        // log all http requests
        // https://axios-http.com/docs/interceptors
        this.httpClient.interceptors.request.use((request) => {
            const date = new Date().toUTCString();
            const prefix = `[TMDB: ${date}]`;
            const fullURL = `${request?.baseURL ?? ""}${request?.url}`;
            const methodString = request?.method?.toUpperCase() ?? "GET";
            let message = `${prefix} ${methodString} to ${fullURL}`;
            if (request?.data) {
                message += ` with body:\n${request.data}`;
            }
            console.log(message);

            return request;
        });

    }

    // MARK: Endpoints

    /**
     * Get the primary information about a tv show.
     *
     * https://developers.themoviedb.org/3/tv/get-tv-details
     *
     * @param {string | Number} id the tv show id
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
     * Get the images that belong to a TV show.
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
     * Gets a user's list by id. Private lists can only be accessed by their
     * owners.
     *
     * https://developers.themoviedb.org/3/lists/get-list-details
     *
     * @param {string | Number} listID the list id
     * @param {{
     *     page?: Number | null | undefined,
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

    // MARK: Authorization

    // (todo)

    // MARK: HTTP Request Methods

    /**
     * Makes a GET request to the TMDB API.
     *
     * @param {string} path the path of the endpoint, which will be appended to
     * `TMDB.apiBase`.
     * @param {Object.<string, string | number | null | undefined> | null | undefined} [queryParams] the query parameters for
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
     * @param {Object.<string, string | number | null | undefined> | null | undefined} [queryParams] the query parameters for the endpoint
     * @param {Object | null | undefined} [body] the body of the request
     * @returns {Promise<any>} the response body from the server
     */
    async _apiRequest(method, path, queryParams, body) {

        try {

            // https://axios-http.com/docs/req_config
            const response = await this.httpClient.request({
                method: method,
                baseURL: TMDB.apiBase,
                url: path,
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json;charset=utf-8"
                },
                // "params that are null or undefined are not rendered in the URL."
                params: queryParams,
                data: body
            });

            return response.data;

        } catch (error) {
            throw error?.response?.data ?? error;
        }

    }

}
