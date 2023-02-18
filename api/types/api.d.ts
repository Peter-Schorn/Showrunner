
export interface TMDBGeneralResponse {
    status_code: number;
    status_message: string;
    success?: boolean | null | undefined;
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
