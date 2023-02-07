import useIntersectionObserver from "../hooks/useIntersectionObserver";
import useMediaQuery from "../hooks/useMediaQuery";
import { api } from "../lib/tmdb";
import styles from "../styles/card.module.scss";
import type { MediaType } from "../types/app";
import type { PosterSizes } from "../types/tmdb";
import { j } from "../utils";

const Card = ({
  cardId,
  mediaType,
  posterImg,
  lazyLoad = false,
  ...restProps
}: {
  cardId: number;
  mediaType: MediaType;
  posterImg: string;
  lazyLoad?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const { ref, setRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      rootMargin: "0px 20px",
      once: true,
    });
  const tabletUp = useMediaQuery("tablet-up");
  const posterSize: PosterSizes = tabletUp ? "w342" : "w185";

  // NOTE: The only reason I'm not doing native `loading="lazy"` here is because
  // Firefox won't let me. The property, for some reason, has no effect in
  // Firefox, although it is working fine in Chrome.
  return (
    <div
      ref={setRef}
      className={j(styles.card, "shimmer", "card")}
      data-card-id={cardId}
      data-card-media-type={mediaType}>
      <img
        {...(isIntersecting && {
          src: api.getPosterURL(posterImg, posterSize),
        })}
        onLoad={() => {
          if (ref.current) {
            ref.current.classList.remove("shimmer");
            ref.current.classList.add(styles.loaded);
          }
        }}
        {...restProps}
      />
    </div>
  );
};

export default Card;
