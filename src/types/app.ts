import type {
  CustomURLSearchParams,
  MovieGenericEndpoints,
  TVGenericEndpoints,
} from "./tmdb";

export type MediaType = "movie" | "tv" | "person";

export type MyList = {
  id: number;
  poster_path: string;
  media_type: MediaType;
};

// Currently handled endpoints:
export type SliderEndPoint =
  | "discover/movie"
  | "discover/tv"
  | "search/multi"
  | `movie/${MovieGenericEndpoints}`
  | `movie/${number}/recommendations`
  | `tv/${TVGenericEndpoints}`
  | `tv/${number}/recommendations`;

export type SliderQueries = {
  title?: string;
  endpoint: SliderEndPoint;
  params?: CustomURLSearchParams;
};
