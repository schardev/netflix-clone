import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { TV_GENRE } from "../lib/constants";
import styles from "../styles/slider.module.scss";
import type { SliderQueries } from "../types/app";

const queries: SliderQueries[] = [
  {
    title: "Popular",
    endpoint: "tv/popular",
  },
  {
    title: "Top Airing",
    endpoint: "tv/on_the_air",
  },
  {
    title: "Top Rated",
    endpoint: "tv/top_rated",
  },
  {
    title: "Crime",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.CRIME,
    },
  },
  {
    title: "Mystery",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.MYSTERY,
    },
  },
  {
    title: "Animation",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.ANIMATION,
    },
  },
  {
    title: "Action & Adventure",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.ACTION_ADVENTURE,
    },
  },
  {
    title: "Reality",
    endpoint: "discover/tv",
    params: {
      with_genres: TV_GENRE.REALITY,
    },
  },
];

const TVPage = () => {
  return (
    <>
      <Banner endpoint="tv/popular" />
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

export default TVPage;
