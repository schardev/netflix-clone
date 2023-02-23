import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { useRef, useState } from "react";
import useFetch from "../hooks/useFetch";
import useMediaQuery from "../hooks/useMediaQuery";
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

type SliderData = MovieListResponse | TVListResponse | PersonListResponse;

const Slider = ({ title, endpoint, flow, params }: SliderProps) => {
  const searchParams = new URLSearchParams(params as any).toString();
  const tabletUp = useMediaQuery("tablet-up");
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data, error } = useFetch<SliderData>(
    `${endpoint}/${searchParams}/slider`,
    ({ signal }) => {
      return api.makeRequest(endpoint, {
        query: params,
        init: { signal },
      });
    }
  );

  // whether slider carousel buttons should be enabled or not
  const [carouselBtnState, setCarouselBtnState] = useState({
    left: false,
    right: true,
  });

  if (error) {
    console.error(error);
    return null;
  }

  // Result might be empty due to invalid endpoint or params being passed
  if (!data || !data.results?.length) return null;

  const handleCarouselScroll = () => {
    const ref = carouselRef.current;
    if (!ref) return;

    const carouselAtStart = ref.scrollLeft === 0;
    const carouselAtEnd =
      ref.scrollWidth - ref.clientWidth === Math.floor(ref.scrollLeft);
    const carouselAtMiddle = !carouselAtStart && !carouselAtEnd;

    // if the carousel is at start and the left button isn't already disabled
    if (carouselAtStart && carouselBtnState.left) {
      setCarouselBtnState({ left: false, right: true });
    }
    // if the carousel is at middle enable both buttons
    else if (
      carouselAtMiddle &&
      (!carouselBtnState.left || !carouselBtnState.right)
    ) {
      setCarouselBtnState({ left: true, right: true });
    }
    // if the carousel is at end and the right button isn't already disabled
    else if (carouselAtEnd && carouselBtnState.right) {
      setCarouselBtnState({ left: true, right: false });
    }
  };

  const handleCarouselButtonClick = (direction: "left" | "right") => {
    const ref = carouselRef.current;
    if (!ref) return;

    if (ref && direction === "left") {
      ref.scrollTo({
        left: ref.scrollLeft - ref.clientWidth + 50,
        behavior: "smooth",
      });
    } else if (ref && direction === "right") {
      ref.scrollTo({
        left: ref.scrollLeft + ref.clientWidth - 50,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles["slider-container"]}>
      {title && <h2>{title}</h2>}
      <div className={styles["slider-carousel-wrapper"]}>
        {tabletUp && flow !== "column" && (
          <button
            className={j(styles["slider-nav-btn"], styles.left)}
            disabled={!carouselBtnState.left}
            onClick={() => handleCarouselButtonClick("left")}>
            <NavArrowLeft />
          </button>
        )}
        <div
          ref={carouselRef}
          className={j(
            styles["slider-carousel"],
            flow === "column" ? styles["slider-carousel__column"] : ""
          )}
          onScroll={handleCarouselScroll}>
          {data.results &&
            data.results.map((item) => {
              let mediaType: MediaType | null = null;
              let imgSrc = (item as any).poster_path || "";
              const altText =
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
                mediaType = multi.media_type;

                // person object doesn't have a poster_path
                if (mediaType === "person") {
                  imgSrc = (item as PersonListResult).profile_path!;
                }
              }

              // if mediaType is still null that means either the endpoint is invalid
              // or the data doesn't include media_type (which it should)
              if (!mediaType) {
                console.error(
                  "Unhandled item category found: ",
                  item,
                  endpoint
                );
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
        {tabletUp && flow !== "column" && (
          <button
            className={j(styles["slider-nav-btn"], styles.right)}
            disabled={!carouselBtnState.right}
            onClick={() => handleCarouselButtonClick("right")}>
            <NavArrowRight />
          </button>
        )}
      </div>
    </section>
  );
};

export default Slider;
