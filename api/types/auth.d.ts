
/**
 * https://developers.themoviedb.org/4/auth/create-request-token
 */
export interface RequestTokenInfoV4 {
    success: boolean;
    status_code: number;
    status_message: string;
    request_token: string;
}

/**
 * https://developers.themoviedb.org/4/auth/create-access-token
 */
export interface AccessTokenInfoV4 {
    success: boolean;
    status_code: number;
    status_message: string;
    access_token: string;
    account_id: string
}

export interface SessionResponse {
    success: boolean;
    session_id: string;
}
