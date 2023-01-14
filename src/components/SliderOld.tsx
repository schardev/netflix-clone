import { memo, useEffect, useState } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { api } from "../lib/tmdb";
import styles from "../styles/homepage.module.scss";
import type { MovieListResponse, TVListResponse } from "../types/tmdb";
import { j } from "../utils";

type SliderProps = {
  flow?: "row" | "column";
  heading?: string;
  queryFn: (page?: number) => Promise<MovieListResponse | TVListResponse>;
};

const Slider = ({ heading, queryFn, flow }: SliderProps) => {
  const [cardItems, setCardItems] = useState<MovieListResponse>();
  const [ref, isIntersecting] = useIntersectionObserver();

  // NOTE: Currently the way we're detecting the visiblilty of last card causes
  // the slider to render trice (one after setting the initial card items, second
  // after setting isIntersecting state in the observer callback and third, after
  // firing the observer callback when the card is visible).
  // Maybe there's a better way to do this but till then this works like charm.
  useEffect(() => {
    if (isIntersecting) {
      queryFn(cardItems?.page! + 1).then((res) => {
        setCardItems((oldState) => {
          return {
            page: res.page,
            results: [...oldState?.results!, ...res.results!],
          };
        });
      });
    }
  }, [isIntersecting]);

  // TODO: use abort controller
  useEffect(() => {
    queryFn().then((res) => {
      setCardItems(res);
    });
  }, []);

  if (!cardItems) return null;

  return (
    <section className={styles["list-section"]}>
      {heading && <h2>{heading}</h2>}
      <div
        className={j(
          styles["list-section__slider"],
          flow === "row" ? styles["row-grid"] : styles["column-grid"]
        )}
      >
        {cardItems.results &&
          cardItems.results.map((item, idx) => {
            if (cardItems.results?.length! - 1 === idx) {
              return (
                <div ref={ref} key={item.id} data-item-id={item.id}>
                  <img src={api.getPosterURL(item.poster_path!)} />
                </div>
              );
            }
            return (
              // TODO: heading is undefined sometimes
              <div key={item.id} data-item-id={item.id}>
                <img src={api.getPosterURL(item.poster_path!)} />
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default memo(Slider);
