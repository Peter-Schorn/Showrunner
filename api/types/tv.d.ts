// Adapted from: https://github.com/blakejoy/tmdb-ts/blob/master/src/types/tv-shows.ts

/**
 * The details of a TV show.
 */
export interface TVShowDetails {
    backdrop_path: string;
    created_by: CreatedBy[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: LastEpisodeToAir;
    /** The name of the show. */
    name: string;
    next_episode_to_air?: any;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    seasons: Season[];
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
}

export interface CreatedBy {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
}

export interface LastEpisodeToAir {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
}

export interface Network {
    name: string;
    id: number;
    logo_path: string;
    origin_country: string;
}

export interface Season {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
}

export interface GuestStar {
    credit_id: string
    order: number
    character: string
    adult: boolean
    gender: number | null
    id: number
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path: string | null

}

export interface TVShowItem {
    id: string;
    action: string;
    time: string;
    value: any;
    iso_639_1: string;
    original_value: any;
}

export interface Network {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}

export interface EpisodeGroup {
    description: string;
    episode_count: number;
    group_count: number;
    id: string;
    name: string;
    network: Network;
    type: number;
}

export interface EpisodeGroups {
    results: EpisodeGroup[];
    id: number;
}

export interface ScreenedTheatricallyResult {
    id: number;
    episode_number: number;
    season_number: number;
}

export interface ScreenedTheatrically {
    id: number;
    results: ScreenedTheatricallyResult[];
}

export interface SimilarTVShows {
    page: number;
    results: SimilarTVShow[];
    total_pages: number;
    total_results: number;
}

export interface SimilarTVShow {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_name: string;
    overview: string;
    origin_country: string[];
    poster_path: string;
    popularity: number;
    name: string;
    vote_average: number;
    vote_count: number;
}

export interface LatestTVShows {
    backdrop_path?: any;
    created_by: any[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    name: string;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview?: any;
    popularity: number;
    poster_path?: any;
    production_companies: any[];
    seasons: Season[];
    status: string;
    type: string;
    vote_average: number;
    vote_count: number;
}


export interface OnTheAirResult {
    poster_path: string;
    popularity: number;
    id: number;
    backdrop_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
    origin_country: string[];
    genre_ids: number[];
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
}

export interface OnTheAir {
    page: number;
    results: OnTheAirResult[];
    total_results: number;
    total_pages: number;
}


export interface AiringTodayResult {
    poster_path: string;
    popularity: number;
    id: number;
    backdrop_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
    origin_country: string[];
    genre_ids: number[];
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
}

export interface TVShowsAiringToday {
    page: number;
    results: AiringTodayResult[];
    total_results: number;
    total_pages: number;
}

export interface PopularTVShowResult {
    poster_path: string;
    popularity: number;
    id: number;
    backdrop_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
    origin_country: string[];
    genre_ids: number[];
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
}

/**
 * Used for popular tv shows, top rated tv shows, and search tv shows response:
 *
 * https://developers.themoviedb.org/3/tv/get-popular-tv-shows
 * https://developers.themoviedb.org/3/search/search-tv-shows
 * https://developers.themoviedb.org/3/tv/get-top-rated-tv
 */
export interface TVShowsResponse {
    page: number;
    results: PopularTVShowResult[];
    total_results: number;
    total_pages: number;
}


export interface TopRatedTVShowResult {
    poster_path: string;
    popularity: number;
    id: number;
    backdrop_path: string;
    vote_average: number;
    overview: string;
    first_air_date: string;
    origin_country: string[];
    genre_ids: number[];
    original_language: string;
    vote_count: number;
    name: string;
    original_name: string;
}

export interface TopRatedTVShows {
    page: number;
    results: TopRatedTVShowResult[];
    total_results: number;
    total_pages: number;
}


export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    name: string;
    id: Number;
    logo_path: string | null;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    iso_639_1: string;
    name: string;
}

export interface TVShowAlternativeTitles {
    id: number;
    results: TVShowAlternativeTitlesResult[];
}

export interface TVShowAlternativeTitlesResult {
    title: string;
    iso_3166_1: string;
    type: string;
}

export interface TVShowChanges {
    changes: TVShowChange[];
}

export interface TVShowChange {
    key: string;
    items: TVShowChangeItem[];
}

export interface TVShowChangeItem {
    id: string;
    action: string;
    time: string;
}

export interface TVShowContentRatings {
    id: string;
    results: TVShowContentRating[];
}

export interface TVShowContentRating {

    /**
     * The language for this content rating in ISO 3166-1 format. E.g., "US".
     */
    iso_3166_1: string;

    /**
     * A human-readable rating (in the language specified by `iso_3166_1`), such
     * as "TV-MA", or "18+".
     */
    rating: string;

}

export interface TVShowExternalIDs {
    imdb_id: string;
    freebase_mid: string;
    freebase_id: string;
    tvdb_id: number;
    tvrage_id: number;
    facebook_id: string;
    instagram_id: string;
    twitter_id: string;
    id: number;
}

export interface TVShowImages {
    backdrops: TVShowBackdrop[];
    id: number;
    posters: TVShowBackdrop[];
}

export interface TVShowBackdrop {
    aspect_ratio: number;
    file_path: string;
    height: number;
    iso_639_1: string | null;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface TVShowRecommendations {
    page: number;
    results: TVShowRecommendationsResult[];
    total_pages: number;
    total_results: number;
}

export interface TVShowRecommendationsResult {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_name: string;
    overview: string;
    origin_country: string[];
    poster_path: string;
    popularity: number;
    name: string;
    vote_average: number;
    vote_count: number;
}

export interface TVShowReviews {
    id: number;
    page: number;
    results: TVShowReview[];
    total_pages: number;
    total_results: number;
}

export interface TVShowReview {
    author: string;
    author_details: AuthorDetails;
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    url: string;
}

export interface AuthorDetails {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number;
}
