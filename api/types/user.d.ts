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
