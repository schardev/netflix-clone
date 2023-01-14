import { useDeviceContext } from "../contexts/DeviceContext";
import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/slider.module.scss";
import type {
  CustomURLSearchParams,
  MovieListResponse,
  MovieListResult,
  MultiListResponse,
  PersonListResponse,
  PersonListResult,
  TVListResponse,
  TVListResult,
} from "../types/tmdb";
import { j } from "../utils";
import ShimmerImg from "./ShimmerImg";

export type SliderQueries = {
  title?: string;
  endpoint: string;
  params?: CustomURLSearchParams;
};

type SliderProps = {
  flow?: "row" | "column";
} & SliderQueries;

// Currently handled endpoints:
// - movie/{popular,etc} --> MovieListResponse
// - tv/{popular.etc} --> TVListResponse
// - discover/movie --> MovieListResponse
// - discover/tv --> TVListResponse
// - search/movie --> MovieListResponse
// - search/tv --> TVListResponse
// - search/multi --> ListResponseWithMedia<MovieListResponse | TVListResponse | PersonListResponse>
const Slider = ({ title, endpoint, flow, params }: SliderProps) => {
  const searchParams = new URLSearchParams(params as any).toString();
  const device = useDeviceContext();
  const { data, error } = useFetch<
    MovieListResponse | TVListResponse | PersonListResponse
  >(`${endpoint}/${searchParams}/slider`, ({ signal }) => {
    return api.makeRequest(endpoint, {
      query: params,
      init: { signal },
    });
  });

  // TODO: add loading glimmer
  if (error || !data || !data.results?.length) return null;

  return (
    <section className={styles["list-section"]}>
      {title && <h2>{title}</h2>}
      <div
        className={j(
          styles["list-section__slider"],
          flow === "row" ? styles["row-grid"] : styles["column-grid"]
        )}>
        {data.results &&
          data.results.map((item, idx) => {
            let category: Category | null = null;
            let imgSrc =
              (item as MovieListResult | TVListResult).poster_path || "";
            let altText = "";

            if (endpoint.includes("movie")) {
              category = "movie";
              altText = (item as MovieListResult).title || "";
            } else if (endpoint.includes("tv")) {
              category = "tv";
              altText = (item as TVListResult).name || "";
            } else if (endpoint.includes("multi")) {
              const multi = item as MultiListResponse;
              if (multi.media_type) {
                category = multi.media_type;
                if (category === "person") {
                  imgSrc = (item as PersonListResult).profile_path!;
                }
              }
            }

            // if category is still null that means either the endpoint is invalid
            // or the data doesn't include media_type (which it should)
            if (!category) {
              console.error("Unhandled item category found: ", item);
              return null;
            }

            // Lazily load images that are out of viewport
            let loading: "eager" | "lazy" = "eager";
            if (
              ((device === "mobile" && idx > 4) || idx > 7) &&
              flow !== "row"
            ) {
              loading = "lazy";
            }

            return (
              <div
                key={item.id}
                data-item-id={item.id}
                data-item-category={category}>
                <ShimmerImg
                  src={api.getPosterURL(imgSrc)}
                  alt={altText}
                  loading={loading}
                />
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Slider;
