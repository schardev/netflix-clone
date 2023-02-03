import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { MOVIE_GENRE, TV_GENRE } from "../lib/constants";
import styles from "../styles/slider.module.scss";
import type { SliderQueries } from "../types/app";

const queries: SliderQueries[] = [
  {
    title: "Popular Movies",
    endpoint: "discover/movie",
    params: {
      with_watch_providers: 8,
      watch_region: "US",
    },
  },
  {
    title: "Only on Netflix",
    endpoint: "discover/tv",
    params: {
      with_watch_providers: 8,
      watch_region: "US",
    },
  },
  {
    title: "Horror Movies",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.HORROR,
    },
  },
  {
    title: "Popular TV Shows",
    endpoint: "tv/popular",
  },
  {
    title: "Talk Shows",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.TALK,
    },
  },
  {
    title: "Fantasy Movies",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.FANTASY,
    },
  },
  {
    title: "Science Fiction",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.SCI_FI_FANTASY,
    },
  },
  {
    title: "Western",
    endpoint: "discover/movie",
    params: {
      with_genres: MOVIE_GENRE.WESTERN,
    },
  },
];

const Homepage = () => {
  return (
    <>
      <Banner endpoint="discover/movie" />
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

export default Homepage;
