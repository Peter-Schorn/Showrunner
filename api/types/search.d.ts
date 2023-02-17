
/**
 * The options for the tv search endpoint.
 *
 * https://developers.themoviedb.org/3/search/search-tv-shows
 */
export interface TVSearchOptions {

    /**
     * The search query.
     */
    query: string;

    /**
     * Which page to query. default: 1; min: 1; max: 1,000.
     */
    page?: number | null | undefined;

    /**
     * Pass a ISO 639-1 value to display translated data for the fields that
     * support it.
     *
     * minLength: 2
     *
     * pattern: ([a-z]{2})-([A-Z]{2})
     *
     * default: "en-US"
     */
    language?: string | null | undefined;

    /**
     * Choose whether to include adult (pornography) content in the results.
     */
    include_adult?: boolean | null | undefined;


    first_air_date_year?: number | null | undefined;

}
