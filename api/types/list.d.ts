/**
 * A list in a user's library
 */
export interface UserList {

    poster_path: string;

    /** The id of the list. */
    id: number;

    /**
     * The file path for the backdrop. See https://developers.themoviedb.org/3/getting-started/images.
     */
    backdrop_path: string | null;

    total_results: number;
    public: boolean;
    revenue: string;
    page: number;
    /** An array of the movies and tv shows in the list. */
    results: (UserListMovie | UserListTVShow)[];
    object_ids?: any;
    iso_639_1: string;
    total_pages: number;
    description: string;
    /** The person who created the list. */
    created_by: {
        gravatar_hash: string;
        name: string;
        username: string;
    };
    iso_3166_1: string;
    average_rating: number;
    runtime: number;
    /** The name of the list. */
    name: string;
    comments?: any;
}

export interface UserListMovie {
    poster_path: string;
    adult: boolean;
    /** The overview for the movie */
    overview: string;
    release_date: string;
    original_title: string;
    genre_ids: number[];
    id: number;
    media_type: string;
    original_language: string;
    title: string;

    /**
     * The file path for the backdrop. See https://developers.themoviedb.org/3/getting-started/images
     */
    backdrop_path: string | null;

    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
}

export interface UserListTVShow {
    poster_path: string;
    popularity: Number;
    id: Number;
    overview: string;

    /**
     * The file path for the backdrop. See https://developers.themoviedb.org/3/getting-started/images
     */
    backdrop_path: string | null;

    vote_average: Number;
    media_type: string;
    first_air_date: string;
    origin_country: string[];
    genre_ids: Number[];
    original_language: string;
    vote_count: Number;
    // The name of the TV show.
    name: string;
    origin_name: string;
}

/**
 * How to sort a user's list.
 */
export type ListSortBy = "original_order.asc" | "original_order.desc" | "release_date.asc" | "release_date.desc" | "title.asc" | "title.desc" | "vote_average.asc" | "vote_average.desc";