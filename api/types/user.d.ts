/**
 * The details of a TMDB user account.
 *
 * https://developers.themoviedb.org/3/account/get-account-details
 */
export interface AccountDetails {
    avatar: {
        gravatar: {
            hash: string
        }
    }
    name: string;
    username: string;
    id: number;
    include_adult: string;
    iso_639_1: string
    iso_3166_1: string
}

export interface AccountListsOptions {
    page?: number | null | undefined;
}

export interface AccountLists {
    page: number;
    results: AccountList[];
    total_pages: number;
    total_results: number;
}

export interface AccountList {
    description: string;
    favorite_count: number;
    id: number;
    item_count: number;
    iso_639_1: string;
    list_type: string;
    name: string;
    poster_path: string | null;
    featured: number;
    revenue: string;
    public: number;
    name: string;
    updated_at: string;
    sort_by: number;
    backdrop_path: string;
    runtime: number;
    average_rating: number;
    iso_3166_1: string;
    adult: number;
    number_of_items: number;
}
