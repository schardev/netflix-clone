import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { MOVIE_GENRE, TV_GENRE } from "../lib/constants";
import sliderStyles from "../styles/slider.module.scss";
import styles from "../styles/genres-page.module.scss";
import { j } from "../utils";

const GenresPage = () => {
  const { category, id } = useParams();

  if ((category !== "movie" && category !== "tv") || !id) {
    throw new Response(
      `Invalid category route or id provided: ${category} - ${id}`,
      { status: 404, statusText: "Not Found" }
    );
  }

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
      <div
        className={j(
          sliderStyles["list-container"],
          styles["genre-list-container"]
        )}>
        <Slider
          title={genreName.split("_").join(" ").toLowerCase()} // TODO
          endpoint={`discover/${category}`}
          params={{
            with_genres: id,
          }}
          flow="column"
        />
      </div>
    </>
  );
};

export default GenresPage;
