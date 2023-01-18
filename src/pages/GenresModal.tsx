import ListModal from "../components/ListModal";
import { MOVIE_GENRE, TV_GENRE } from "../lib/constants";

const splitJoin = (str: string) => {
  // doing lowercase since we'll properly capitalize them using css
  return str.split("_").join(" ").toLowerCase();
};

export const movieGenreEntries = {
  title: "MOVIES",
  list: Object.entries(MOVIE_GENRE).map((genre) => {
    return {
      text: splitJoin(genre[0]),
      link: `/genres/movie/${genre[1]}`,
    };
  }),
};

export const tvGenreEntries = {
  title: "TV",
  list: Object.entries(TV_GENRE).map((genre) => {
    return {
      text: splitJoin(genre[0]),
      link: `/genres/tv/${genre[1]}`,
    };
  }),
};

const entries = [movieGenreEntries, tvGenreEntries];

const GenresModal = () => {
  return <ListModal entries={entries} />;
};

export default GenresModal;
