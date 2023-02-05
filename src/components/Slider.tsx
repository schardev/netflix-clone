import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/slider.module.scss";
import type { MediaType, SliderQueries } from "../types/app";
import type {
  MovieListResponse,
  MovieListResult,
  MultiListResponse,
  PersonListResponse,
  PersonListResult,
  TVListResponse,
  TVListResult,
} from "../types/tmdb";
import { j } from "../utils";
import Card from "./Card";

type SliderProps = {
  flow?: "row" | "column";
} & SliderQueries;

const Slider = ({ title, endpoint, flow, params }: SliderProps) => {
  const searchParams = new URLSearchParams(params as any).toString();
  const { data, error } = useFetch<
    MovieListResponse | TVListResponse | PersonListResponse
  >(`${endpoint}/${searchParams}/slider`, ({ signal }) => {
    return api.makeRequest(endpoint, {
      query: params,
      init: { signal },
    });
  });

  if (error) {
    console.error(error);
    return null;
  }

  // Result might be empty due to invalid endpoint or params being passed
  if (!data || !data.results?.length) return null;

  return (
    <section className={styles["slider-container"]}>
      {title && <h2>{title}</h2>}
      <div
        className={j(
          styles["slider-carousel"],
          flow === "column" ? styles["slider-carousel__column"] : ""
        )}>
        {data.results &&
          data.results.map((item) => {
            let mediaType: MediaType | null = null;
            let imgSrc = (item as any).poster_path || "";
            let altText =
              (item as PersonListResult | TVListResult).name ||
              (item as MovieListResult).title ||
              "";

            // Based on the endpoint, set the mediaType accordingly
            if (endpoint.includes("movie")) {
              mediaType = "movie";
            } else if (endpoint.includes("tv")) {
              mediaType = "tv";
            } else if (endpoint.includes("multi")) {
              const multi = item as MultiListResponse;
              if (multi.media_type) {
                mediaType = multi.media_type;

                // person object doesn't have a poster_path
                if (mediaType === "person") {
                  imgSrc = (item as PersonListResult).profile_path!;
                }
              }
            }

            // if mediaType is still null that means either the endpoint is invalid
            // or the data doesn't include media_type (which it should)
            if (!mediaType) {
              console.error("Unhandled item category found: ", item);
              return null;
            }

            return (
              <Card
                key={item.id!}
                cardId={item.id!}
                mediaType={mediaType}
                posterImg={imgSrc}
                alt={altText}
              />
            );
          })}
      </div>
    </section>
  );
};

export default Slider;
