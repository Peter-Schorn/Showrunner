const axios = require("axios").default;

// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
/**
 * @typedef { import("./types").TVShowDetails } TVShowDetails
 * @typedef { import("./types").UserList } UserList
 * @typedef { import("./types").ListSortBy } ListSortBy
 */


/**
 * A class that provides access to the TMDB API.
 *
 * https://developers.themoviedb.org/3/getting-started/introduction
 */
class TMDB {

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
     * @param {String | Number} id the tv show id
     * @param {String | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowDetails>} the details of a TMDB tv show
     */
    async tvShowDetails(id, language) {
        return await this._get(
            `/3/tv/${id}`,  // path
            { language: language }  // query params
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
            `/3/list/${listID}`,
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
     * @param {string} method the http method
     * @param {string} path the path of the endpoint, which will be appended to
     * `TMDB.apiBase`.
     * @param {Object.<string, string | number | null | undefined> | null | undefined} [queryParams] the query parameters for
     * the endpoint
     * @param {Object | null | undefined} [body] the body of the request
     * @returns {Promise<any>} the response body from the server
     */
    async _apiRequest(method, path, queryParams, body) {

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
    }

}

exports.default = TMDB;