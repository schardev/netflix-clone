import { useRef } from "react";
import { api } from "../lib/tmdb";
import type { MediaType } from "../types/app";

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
  const placeholderRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="card"
      data-card-id={cardId}
      data-card-media-type={mediaType}>
      <div ref={placeholderRef} className="shimmer"></div>
      <img
        src={api.getPosterURL(posterImg)}
        onLoad={() => {
          placeholderRef.current?.remove();
        }}
        loading={lazyLoad ? "lazy" : "eager"}
        {...restProps}
      />
    </div>
  );
};

export default Card;
