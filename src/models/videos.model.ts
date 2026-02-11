export type Video = {
    id: string;
    iso_639_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
};

export type VideosResponse = {
    id: number;
    results: Video[];
};