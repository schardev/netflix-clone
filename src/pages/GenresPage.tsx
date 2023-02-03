import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { MOVIE_GENRE, TV_GENRE } from "../lib/constants";

const GenresPage = () => {
  const { category, id } = useParams();

  // TODO: throw 404
  if ((category !== "movie" && category !== "tv") || !id) return null;

  let genreName: string;
  if (category === "movie") {
    genreName =
      Object.keys(MOVIE_GENRE).find(
        (name) => (MOVIE_GENRE as any)[name] == id
      ) || "";
  } else {
    genreName =
      Object.keys(TV_GENRE).find((name) => (TV_GENRE as any)[name] == id) || "";
  }

  return (
    <>
      <Banner endpoint={`discover/${category}`} params={{ with_genres: id }} />
      <Slider
        title={genreName.split("_").join(" ").toLowerCase()} // TODO
        endpoint={`discover/${category}`}
        params={{
          with_genres: id,
        }}
        flow="row"
      />
    </>
  );
};

export default GenresPage;
