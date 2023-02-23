import type {
  BackdropSizes,
  CustomURLSearchParams,
  ImageSizes,
  LogoSizes,
  MovieDetails,
  MovieGenericEndpoints,
  MovieListResponse,
  MovieReleaseDates,
  PosterSizes,
  StillSizes,
  TMDBConfig,
  TVDetails,
  TVGenericEndpoints,
  TVListResponse,
  Videos,
} from "../types/tmdb";
import { TMDB_CONFIG } from "./constants";

type MakeRequestOptions = {
  query?: CustomURLSearchParams;
  init?: RequestInit;
};

type ImgPath = string | null | undefined;

export class TMDB {
  #api_key: string;

  constructor(apiKey: string) {
    this.#api_key = apiKey;
  }

  async makeRequest<T = any>(
    endpoint: string,
    options: MakeRequestOptions = {}
  ): Promise<T> {
    let baseURL = `https://api.themoviedb.org/3/${endpoint}?api_key=${
      this.#api_key
    }`;

    const { query, init } = options;

    if (query) {
      const urlParams = new URLSearchParams(
        query as unknown as string
      ).toString();
      baseURL += `&${urlParams}`;
    }

    try {
      const res = await fetch(baseURL, init);
      if (!res.ok) throw res;
      return res.json();
    } catch (e) {
      if (e instanceof Response) throw e;
      throw new Error(
        `[TMDB] Something went horribly wrong: ${(e as Error).message}`
      );
    }
  }

  configuration(): Promise<TMDBConfig> {
    return this.makeRequest("configuration");
  }

  movieDetails(
    id: number | string,
    options?: MakeRequestOptions
  ): Promise<MovieDetails> {
    return this.makeRequest(`movie/${id}`, options);
  }

  movieRecommendations(
    id: string | number,
    options?: MakeRequestOptions
  ): Promise<MovieListResponse> {
    return this.makeRequest(`movie/${id}/recommendations`, options);
  }

  movieReleaseDates(
    id: string | number,
    options?: MakeRequestOptions
  ): Promise<MovieReleaseDates> {
    return this.makeRequest(`movie/${id}/release_dates`, options);
  }

  movieVideos(
    id: number | string,
    options?: MakeRequestOptions
  ): Promise<Videos> {
    return this.makeRequest(`movie/${id}/videos`, options);
  }

  movieGenericRequest(
    endpoint: MovieGenericEndpoints,
    options?: MakeRequestOptions
  ): Promise<MovieListResponse> {
    return this.makeRequest(`movie/${endpoint}`, options);
  }

  tvGenericRequest(
    endpoint: TVGenericEndpoints,
    options?: MakeRequestOptions
  ): Promise<MovieListResponse> {
    return this.makeRequest(`tv/${endpoint}`, options);
  }

  tvDetails(
    id: number | string,
    options?: MakeRequestOptions
  ): Promise<TVDetails> {
    return this.makeRequest(`tv/${id}`, options);
  }

  tvRecommendations(
    id: string | number,
    options?: MakeRequestOptions
  ): Promise<TVListResponse> {
    return this.makeRequest(`tv/${id}/recommendations`, options);
  }

  tvVideos(id: number | string, options?: MakeRequestOptions): Promise<Videos> {
    return this.makeRequest(`tv/${id}/videos`, options);
  }

  // TODO: Break below low level api to more generic methods
  movieRequest<T>(
    endpoint: string | number,
    options?: MakeRequestOptions
  ): Promise<T> {
    const ep = `movie/${endpoint}`;
    return this.makeRequest(ep, options);
  }

  tvRequest<T>(endpoint: string | number, options?: MakeRequestOptions) {
    const ep = `tv/${endpoint}`;
    return this.makeRequest<T>(ep, options);
  }

  getImageURL(path: ImgPath, size: ImageSizes) {
    if (path) return TMDB_CONFIG.images.secure_base_url + size + path;
    // TODO: use static local asset instead
    return `https://via.placeholder.com/${size.slice(1)}/000?text=Placeholder`;
  }

  getPosterURL(posterPath: ImgPath, size: PosterSizes = "w185") {
    if (!posterPath) return "/poster_placeholder.png";
    return this.getImageURL(posterPath, size);
  }

  getBackdropURL(backdropPath: ImgPath, size: BackdropSizes = "w780") {
    if (!backdropPath) return "/still_placeholder.png";
    return this.getImageURL(backdropPath, size);
  }

  getLogoURL(logoPath: ImgPath, size: LogoSizes = "w300") {
    return this.getImageURL(logoPath, size);
  }

  getStillURL(stillPath: ImgPath, size: StillSizes = "w185") {
    if (!stillPath) return "/still_placeholder.png";
    return this.getImageURL(stillPath, size);
  }

  getByGenre(
    endpoint: "movie" | "tv",
    genreID: number | number[],
    options: MakeRequestOptions = {}
  ): Promise<MovieListResponse | TVListResponse> {
    const { query: _query, init } = options;
    const query = {
      with_genres: genreID,
      sort_by: "popularity.desc",
      ..._query,
    };
    return this.makeRequest(`discover/${endpoint}`, { query, init });
  }
}

export const api = new TMDB(import.meta.env.VITE_TMDB_API);
