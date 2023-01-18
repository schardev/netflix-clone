import { motion, Variants } from "framer-motion";
import {
  Check,
  DeleteCircledOutline,
  InfoEmpty,
  NavArrowDown,
  NavArrowRight,
  PlayOutline,
  Plus,
  ShareAndroid,
  SoundHigh,
  SoundOff,
  ThumbsUp,
} from "iconoir-react";
import { useRef, useState } from "react";
import type ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";
import { useModalData, useModalDispatcher } from "../contexts/ModalContext";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/desktop-info-modal.module.scss";
import type {
  Credits,
  ListResponse,
  MovieDetails,
  TVDetails,
  Videos,
} from "../types/tmdb";
import Portal from "./Portal";
import YouTubeIFrame from "./YouTubeIFrame";

type ExtendedRequest<T> = T & { videos: Videos } & { credits: Credits } & {
  recommendations: ListResponse<T>;
};
type DesktopInfoModalProps = {
  category: Exclude<Category, "person">;
  id: number;
  x: number;
  y: number;
};

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.7 },
};

const DesktopInfoModal = ({ category, id, x, y }: DesktopInfoModalProps) => {
  const myList = useMyListData();
  const dispatchToList = useMyListDispatcher();
  const setModalState = useModalDispatcher();
  const navigate = useNavigate();
  const playerRef = useRef<ReactPlayer>(null);
  const [muted, setIsMuted] = useState(true);
  const { error, data, isLoading } = useFetch(
    `${category}/${id}/desktopmodal`,
    ({ signal }) => {
      return api.makeRequest<ExtendedRequest<MovieDetails | TVDetails>>(
        `${category}/${id}`,
        {
          query: {
            append_to_response: "videos,credits,recommendations",
          },
          init: { signal },
        }
      );
    }
  );

  if (!data || isLoading) return null;
  const closeModal = () => setModalState({ visible: false });

  let releaseYear: number | string = "";
  let runtime = "";
  let title = "";
  let season = 0;

  if (category === "tv") {
    let tvShow = data as TVDetails;
    releaseYear = tvShow.first_air_date
      ? new Date(tvShow.first_air_date!).getFullYear()
      : "TBA";
    runtime = tvShow.number_of_episodes
      ? `${tvShow.number_of_episodes} Episodes`
      : "";
    title = tvShow.name!;
    season = tvShow.number_of_seasons || 0;
  } else {
    let movie = data as MovieDetails;
    releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "";
    title = movie.title!;

    if (movie.runtime) {
      let _hr = (movie.runtime / 60).toFixed();
      let _min = movie.runtime % 60;
      runtime = `${_hr}h ${_min}min`;
    }
  }
  const videos = data.videos.results!.length >= 1 ? data.videos.results : null;

  const isInList = myList.filter((item) => item.id === data.id!).length > 0;
  const handleClick = () => {
    if (isInList) {
      dispatchToList({
        type: "remove",
        payload: { id: data.id!, media_type: category },
      });
    } else {
      dispatchToList({
        type: "add",
        payload: {
          id: data.id!,
          media_type: category,
          poster_path: api.getPosterURL(data.poster_path),
        },
      });
    }
  };

  return (
    <Portal>
      <motion.div
        key={Math.random()} // FIXME
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: "tween", duration: 0.2 }}
        style={{ top: y, left: x }}
        className={styles["modal-container"]}
        onPointerLeave={() => setModalState({ visible: false })}>
        {videos ? (
          <div className={styles["player"]}>
            <YouTubeIFrame
              ref={playerRef}
              videoKey={videos[0].key!}
              playing={true}
              controls={true}
              muted={muted}
              loop={true}
              onError={() => {
                console.log("error playing video");
              }}
            />
            <div
              className={styles["player-control"]}
              onClick={() => setIsMuted(!muted)}>
              {muted ? <SoundOff /> : <SoundHigh />}
            </div>
          </div>
        ) : (
          <img src={api.getBackdropURL(data.backdrop_path)} alt="" />
        )}
        <div className={styles["modal-info"]}>
          <div className={styles["small-modal-menu"]}>
            <ul>
              <li>
                <button className={styles["ply-btn"]}>
                  <PlayOutline />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    dispatchToList({
                      type: "add",
                      payload: {
                        id: data.id!,
                        media_type: category,
                        poster_path: api.getPosterURL(data.poster_path),
                      },
                    });
                  }}>
                  {isInList ? <Check /> : <Plus />}
                </button>
              </li>
              <li>
                <button>
                  <ThumbsUp />
                </button>
              </li>
              <li>
                <button>
                  <NavArrowDown />
                </button>
              </li>
            </ul>
          </div>
          <div className={styles["modal-info__details"]}>
            <h2>{title}</h2>
            <span className={styles["span-match"]}>69% match</span>
            {season > 1 && <span>{`${season} Seasons`}</span>}
            {runtime && (
              <span className={styles["span-runtime"]}>{runtime}</span>
            )}
          </div>
          <ul className={styles["modal-info__genre"]}>
            {data.genres?.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </Portal>
  );
};

export default DesktopInfoModal;
