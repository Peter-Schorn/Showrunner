const axios = require("axios").default;

// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

/**
 * @typedef { import("./types").HTTPMethod } HTTPMethod
 * @typedef { import("./types").TVShowDetails } TVShowDetails
 * @typedef { import("./types").TVShowAlternativeTitles } TVShowAlternativeTitles
 * @typedef { import("./types").TVShowChanges } TVShowChanges
 * @typedef { import("./types").TVShowContentRatings } TVShowContentRatings
 * @typedef { import("./types").TVShowImages } TVShowImages
 * @typedef { import("./types").TVShowRecommendations } TVShowRecommendations
 * @typedef { import("./types").TVShowReviews } TVShowReviews
 * @typedef { import("./types").SimilarTVShows } SimilarTVShows
 * @typedef { import("./types").WatchProviders } WatchProviders
 * @typedef { import("./types").TMDBGeneralResponse } TMDBGeneralResponse
 * @typedef { import("./types").TVSearchOptions } TVSearchOptions
 * @typedef { import("./types").TVShowsResponse } TVShowsResponse
 * @typedef { import("./types").TMDBConfigurationDetails } TMDBConfigurationDetails
 * @typedef { import("./types").TVShowDetailsAndWatchProviders } TVShowDetailsAndWatchProviders
 * @typedef { import("./types").AllTVShowChanges } AllTVShowChanges
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
     * Get the primary information about a tv show and the watch providers.
     * 
     * https://developers.themoviedb.org/3/tv/get-tv-details
     * https://developers.themoviedb.org/3/tv/get-tv-watch-providers
     * 
     * @param {string |  number} id the tv show id
     * @param {string | null | undefined} [language] an ISO 639-1 language code
     * @returns {Promise<TVShowDetailsAndWatchProviders>} the details of a TMDB 
     * tv show and the watch providers
     */
    async tvShowDetailsAndWatchProviders(id, language) {
        const results = await this._get(
            `/3/tv/${id}`,
            { 
                language,
                append_to_response: "watch/providers"
            }
        );
        // rename the "watch/providers" key to "watch_providers"
        if (results?.["watch/providers"]) {
            results.watch_providers = results["watch/providers"];
            delete results["watch/providers"];
        }
        return results;
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
     * Get the changes for a *single* tv show. By default only the last 24 hours 
     * are returned.
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
     * https://developers.themoviedb.org/3/tv/get-tv-changes
     *
     * @param {string | number} id the tv show id
     * @param {{
     *     start_date?: string | null | undefined,
     *     end_date?: string | null | undefined,
     *     page?: number | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     *  start_date: the start date;
     *  end_date: the end date;
     *  page: specify which page to query
     * @returns {Promise<TVShowChanges>} the tv show changes
     */
    async tvShowChanges(id, options) {
        return await this._get(
            `/3/tv/${id}/changes`,  // path
            options  // query params
        );
    }
    
    /**
     * Get a list of *all* of the TV show ids that have been changed. By 
     * default, the last 24 hours are returned.
     * 
     * https://developers.themoviedb.org/3/changes/get-tv-change-list
     * 
     * The `start_date` and `end_date` parameters must be specified in ISO 8601
     * format: https://en.wikipedia.org/wiki/ISO_8601. For example:
     * `2023-3-14T08:30:00.000Z`. If both `start_date` and `end_date` are not
     * provided, then the last 24 hours are returned.
     * 
     * @param {{
     *     start_date?: string | null | undefined,
     *     end_date?: string | null | undefined,
     *     page?: number | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     * start_date: the start of the date range;
     * end_date: the end of the date range;
     * page: the page of results to return; default: 0
     *     
     * @returns {Promise<AllTVShowChanges>} a list of tv show ids that have been 
     * changed within the specified date range
     */
    async allTVShowChanges(options) {
        return await this._get(
            "/3/tv/changes",  // path
            options  // query params
        );
    }
    
    /**
     * @callback OnReceivePage
     * @param {AllTVShowChanges | null} page a page of results, or `null` if
     * an error occurred
     * @param {*} error an error, if one occurred; otherwise, `null`
     */
    
    /**
     * Retrieves all pages of results for the `TMDB.allTVShowChanges` method
     * *concurrently*. Except for the first page, the order of the pages 
     * returned is undefined.
     * 
     * https://developers.themoviedb.org/3/changes/get-tv-change-list
     * 
     * @param {OnReceivePage} onReceivePage a callback function that is called 
     * with each page, or an error, if one occurred
     * @param {{
     *     start_date?: string | null | undefined,
     *     end_date?: string | null | undefined
     * } | null | undefined} [options] the options for this endpoint:
     * start_date: the start of the date range;
     * end_date: the end of the date range;
     */
    allTVShowChangesAllPages(onReceivePage, options) {
        
        // we must retrieve the first page serially in order to get the total
        // number of pages; then, we can retrieve the rest concurrently
        this.allTVShowChanges(options)
            .then((firstPage) => {
                console.log(
                    `did receive first page; actual index: ${firstPage.page}; ` +
                    `total pages: ${firstPage.total_pages}; ` +
                    `total results: ${firstPage.total_results};`
                );
                
                onReceivePage(firstPage, null);
                
                for (
                    // pages are one-indexed
                    let pageIndex = 2; 
                    pageIndex <= firstPage.total_pages; 
                    pageIndex++
                ) {
                    
                    console.log(`will retrieve page ${pageIndex}`);
                    
                    const mergedOptions = {
                        ...options,
                        page: pageIndex
                    };
                    
                    this.allTVShowChanges(mergedOptions)
                        .then((page) => {
                            console.log(
                                `did receive page ${page.page}; ` +
                                `results: ${page.results.length}; ` +
                                `total pages: ${page.total_pages}; ` +
                                `total results: ${page.total_results};`
                            );
                            onReceivePage(page, null);
                        })
                        .catch((error) => {
                            console.error(
                                "allTVShowChangesAllPages: error retrieving " +
                                `page ${pageIndex}:`,
                                error
                            );
                            onReceivePage(null, error);
                        });
                }
                
            }, (firstPageError) => {
                console.error(
                    "allTVShowChangesAllPages: firstPageError:", 
                    firstPageError
                );
                onReceivePage(null, firstPageError);
            });
            
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

    // MARK: Search

    /**
     * Search for tv shows.
     *
     * https://developers.themoviedb.org/3/search/search-tv-shows
     *
     * Example:
     *
     * ```
     * tmdb.searchTVShows({ query: "The Wire", include_adult: true })
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
        const results = await this._get("/3/search/tv", options);
        
        for (const result of results.results) {
            try {
                result.first_air_date = new Date(result.first_air_date).formatted();
            
            } catch (error) {
                console.error(
                    `couldn't parse date: "${result.first_air_date}":`, error
                );
            }
        }
        
        return results;
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
     * qualified URL. Here's an example URL:
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
            };

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
