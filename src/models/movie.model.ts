export interface MovieSummary {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
}

export interface MovieDetails extends MovieSummary {
    overview: string;
    genres: { id: number; name: string }[];
    runtime: number;
}

export interface PagedResponse<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
}