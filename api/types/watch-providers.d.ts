//  ==================
//
//  Adapted from:
//  https://github.com/blakejoy/tmdb-ts/blob/master/src/types/watch-providers.ts
//
//  ==================


export interface WatchProviders {
    id: number;
    results: WatchProvidersResults;
}

export interface WatchProvidersResults {
    [country_code: string]: {
        link?: string | null;
        flatrate?: FlatRate[] | null;
        rent?: WatchProviderRent[] | null;
        buy?: WatchProviderBuy[] | null;
    };
}


export interface FlatRate {
    display_priority: number;
    logo_path: string;
    provider_id: number;
    provider_name: string;
}

export interface WatchProviderRent {
    display_priority: number;
    logo_path: string;
    provider_id: number;
    provider_name: string;
}

export interface WatchProviderBuy {
    display_priority: number;
    logo_path: string;
    provider_id: number;
    provider_name: string;
}
