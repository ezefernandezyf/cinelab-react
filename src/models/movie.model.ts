import type { Genre } from "./genre.model";

export interface MovieSummary {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number | null;
    release_date: string | null;
}

export interface MovieDetails extends MovieSummary {
    overview: string;
    genres: Genre[];
    runtime: number;
}

export interface PagedResponse<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
}