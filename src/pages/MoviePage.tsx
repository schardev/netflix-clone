import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { MOVIE_GENRE } from "../lib/constants";
import styles from "../styles/slider.module.scss";
import type { SliderQueries } from "../types/app";

const queries: SliderQueries[] = [
  {
    title: "Popular",
    endpoint: "movie/popular",
  },
  {
    title: "Upcoming",
    endpoint: "movie/upcoming",
  },
  {
    title: "Top Rated",
    endpoint: "movie/top_rated",
  },
  {
    title: "Crime & Thrillers",
    endpoint: "discover/movie",
    params: {
      with_genres: [MOVIE_GENRE.CRIME, MOVIE_GENRE.THRILLER],
    },
  },
  {
    title: "Animation",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.ANIMATION,
    },
  },
  {
    title: "Documentary",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.DOCUMENTARY,
    },
  },
  {
    title: "Romance",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.ROMANCE,
    },
  },
  {
    title: "Family",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.FAMILY,
    },
  },
];

const MoviePage = () => {
  return (
    <>
      <Banner endpoint="movie/popular" />
      <div className={styles["list-container"]}>
        {queries.map((query) => (
          <Slider
            key={query.title}
            title={query.title}
            endpoint={query.endpoint}
            params={query.params}
          />
        ))}
      </div>
    </>
  );
};

export default MoviePage;
