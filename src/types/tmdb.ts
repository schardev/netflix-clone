import type { TMDB_CONFIG } from "../lib/constants";
import type { MediaType } from "./app";

export interface TMDBConfig {
  images?: {
    base_url?: string;
    secure_base_url?: string;
    backdrop_sizes?: string[];
    logo_sizes?: string[];
    poster_sizes?: string[];
    profile_sizes?: string[];
    still_sizes?: string[];
  };
  change_keys?: string[];
}

// https://github.com/microsoft/TypeScript/issues/32951
export type CustomURLSearchParams = Record<
  string,
  string | number | (string | number)[] | boolean
>;

export type PosterSizes = (typeof TMDB_CONFIG.images.poster_sizes)[number];
export type LogoSizes = (typeof TMDB_CONFIG.images.logo_sizes)[number];
export type BackdropSizes = (typeof TMDB_CONFIG.images.backdrop_sizes)[number];
export type StillSizes = (typeof TMDB_CONFIG.images.still_sizes)[number];
export type ImageSizes = PosterSizes | LogoSizes | BackdropSizes | StillSizes;

export type GenericEndpoints = "latest" | "popular" | "top_rated";
export type MovieGenericEndpoints =
  | GenericEndpoints
  | "now_playing"
  | "upcoming";
export type TVGenericEndpoints =
  | GenericEndpoints
  | "airing_today"
  | "on_the_air";

export type MovieListResponse = ListResponse<MovieListResult>;
export type TVListResponse = ListResponse<TVListResult>;
export type PersonListResponse = ListResponse<PersonListResult>;
export type MultiListResponse = ListResponseWithMedia<
  MovieListResult | TVListResult | PersonListResult
>;
export type ListResponseWithMedia<T> = T & { media_type: MediaType };

export interface TVSeasons {
  _id?: string;
  air_date?: string;
  episodes?: {
    air_date?: string;
    episode_number?: number;
    runtime?: number;
    crew?: {
      department?: string;
      job?: string;
      credit_id?: string;
      adult?: boolean | null;
      gender?: number;
      id?: number;
      known_for_department?: string;
      name?: string;
      original_name?: string;
      popularity?: number;
      profile_path?: string | null;
    }[];
    guest_stars?: {
      credit_id?: string;
      order?: number;
      character?: string;
      adult?: boolean;
      gender?: number | null;
      id?: number;
      known_for_department?: string;
      name?: string;
      original_name?: string;
      popularity?: number;
      profile_path?: string;
    }[];
    id?: number;
    name?: string;
    overview?: string;
    production_code?: string;
    season_number?: number;
    still_path?: string;
    vote_average?: number;
    vote_count?: number;
  }[];
  name?: string;
  overview?: string;
  id?: number;
  poster_path?: string | null;
  season_number?: number;
}

export interface PersonListResult {
  adult?: boolean;
  id?: number;
  known_for?: ListResponseWithMedia<MovieListResult | TVListResult>;
  name?: string;
  popularity?: number;
  profile_path?: string;
}

export interface MovieDetails {
  adult?: boolean;
  backdrop_path?: string | null;
  belongs_to_collection?: null;
  budget?: number;
  genres?: { id?: number; name?: string }[];
  homepage?: string | null;
  id?: number;
  imdb_id?: string | null;
  original_language?: string;
  original_title?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: {
    name?: string;
    id?: number;
    logo_path?: string | null;
    origin_country?: string;
  }[];
  production_countries?: { iso_3166_1?: string; name?: string }[];
  release_date?: string;
  revenue?: number;
  runtime?: number | null;
  spoken_languages?: { iso_639_1?: string; name?: string }[];
  status?:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled";
  tagline?: string | null;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export interface TVDetails {
  backdrop_path?: string | null;
  created_by?: {
    id?: number;
    credit_id?: string;
    name?: string;
    gender?: number;
    profile_path?: string | null;
  }[];
  episode_run_time?: number[];
  first_air_date?: string;
  genres?: { id?: number; name?: string }[];
  homepage?: string | null;
  id?: number;
  in_production?: boolean;
  language?: string[];
  last_air_date?: string;
  last_episode_to_air?: {
    air_date?: string;
    episode_number?: number;
    id?: number;
    name?: string;
    overview?: string;
    production_code?: string;
    season_number?: number;
    still_path?: string | null;
    vote_average?: number;
    vote_count?: number;
  };
  name?: string;
  networks?: {
    name?: string;
    id?: number;
    logo_path?: string | null;
    origin_country?: string;
  }[];
  next_episode_to_air?: null;
  number_of_episodes?: number;
  number_of_seasons?: number;
  origin_country?: string[];
  original_language?: string;
  original_name?: string;
  overview?: string | null;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: {
    name?: string;
    id?: number;
    logo_path?: string | null;
    origin_country?: string;
  }[];
  production_countries?: { iso_3166_1?: string; name?: string }[];
  seasons?: {
    air_date?: string;
    episode_count?: number;
    id?: number;
    name?: string;
    overview?: string;
    poster_path?: string;
    season_number?: number;
  }[];
  spoken_languages?: {
    iso_639_1?: string;
    name?: string;
    english_name?: string;
  }[];
  status?:
    | "Rumored"
    | "Planned"
    | "In Production"
    | "Post Production"
    | "Released"
    | "Canceled";
  tagline?: string | null;
  type?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface Credits {
  id?: number;
  cast?: {
    adult?: boolean;
    gender?: number | null;
    id?: number;
    known_for_department?: string;
    name?: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string | null;
    cast_id?: number;
    character?: string;
    credit_id?: string;
    order?: number;
  }[];
  crew?: {
    adult?: boolean;
    gender?: number | null;
    id?: number;
    known_for_department?: string;
    name?: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string | null;
    credit_id?: string;
    department?: string;
    job?: string;
  }[];
}

export interface MovieExternalIDs {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  id?: number;
}

export type ImageProps = {
  aspect_ratio?: number;
  file_path?: string;
  height?: number;
  id?: number;
  iso_639_1?: string | null;
  vote_average?: number;
  vote_count?: number;
  width?: number;
};

export interface Images {
  backdrops?: ImageProps[];
  posters?: ImageProps[];
  logos?: ImageProps[];
}

export interface Videos {
  id?: number;
  results?: {
    iso_639_1?: string;
    iso_3166_1?: string;
    name?: string;
    key?: string;
    site?: string;
    size?: number;
    type?: string;
    official?: boolean;
    published_at?: string;
    id?: string;
  }[];
}

export interface ListResponse<T> {
  page?: number;
  results?: T[];
  total_pages?: number;
  total_results?: number;
}

export type Provider = {
  display_priority?: number;
  logo_path?: string;
  provider_id?: number;
  provider_name?: string;
};

export interface MovieWatchProviders {
  id?: number;
  results?: {
    [country: string]: {
      link?: string;
      flatrate?: Provider[];
      rent?: Provider[];
      buy?: Provider[];
    };
  };
}

export interface CommonListResult {
  backdrop_path?: string;
  genre_ids?: number[];
  id?: number;
  original_language?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  vote_average?: number;
  vote_count?: number;
}

export interface MovieListResult extends CommonListResult {
  adult?: boolean;
  original_title?: string;
  release_date?: string;
  title?: string;
  video?: boolean;
}

export interface TVListResult extends CommonListResult {
  first_air_date?: string;
  name?: string;
  origin_country?: string;
  original_name?: string;
}

export interface MovieReleaseType {
  1: "Premiere";
  2: "Theatrical (limited)";
  3: "Theatrical";
  4: "Digital";
  5: "Physical";
  6: "TV";
}

export interface MovieNowPlaying extends ListResponse<MovieListResult> {
  dates?: {
    maximum?: string;
    minimum?: string;
  };
}

export interface MovieReleaseDates {
  id?: number;
  results?: {
    iso_3166_1?: string;
    release_dates?: {
      certification?: string;
      iso_639_1?: string;
      release_date: string;
      type?: MovieReleaseType;
      note?: string;
    }[];
  }[];
}

export interface TVContentRatings {
  id?: number;
  results?: {
    iso_3166_1?: string;
    rating?: string;
  }[];
}

export interface ContentRatings {
  results: {
    iso_3166_1: string;
    rating: string;
  }[];
  id: number;
}
