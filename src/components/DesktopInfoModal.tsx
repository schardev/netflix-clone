import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  Check,
  NavArrowDown,
  PlayOutline,
  Plus,
  SoundHigh,
  SoundOff,
  ThumbsUp,
} from "iconoir-react";
import { useRef, useState } from "react";
import type ReactPlayer from "react-player";
import { useModalDispatcher } from "../contexts/ModalContext";
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
import Backdrop from "./Backdrop";
import EpisodeSelector from "./EpisodeSelector";
import Slider from "./Slider";
import VideoFrame from "./VideoFrame";
import YouTubeIFrame from "./YouTubeIFrame";

type ExtendedRequest<T> = T & { videos: Videos } & { credits: Credits } & {
  recommendations: ListResponse<T>;
};
type DesktopInfoModalProps = {
  category: Exclude<Category, "person">;
  id: number;
  x: number;
  y: number;
  expanded?: boolean;
};

const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.7 },
};

const DesktopInfoModal = ({
  category,
  id,
  x,
  y,
  expanded = false,
}: DesktopInfoModalProps) => {
  const myList = useMyListData();
  const dispatchToList = useMyListDispatcher();
  const setModalState = useModalDispatcher();
  const playerRef = useRef<ReactPlayer>(null);
  const [muted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { data, isLoading } = useFetch(
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

  let runtime = "";
  let title = "";
  let season = 0;
  let numberOfSeasons = 1;
  const cast = data.credits.cast;
  const crew = data.credits.crew;
  let starring = cast ? cast.slice(0, 4) : "TBA";
  let director: Credits["crew"] | string = [];

  if (category === "tv") {
    let tvShow = data as TVDetails;
    runtime = tvShow.number_of_episodes
      ? `${tvShow.number_of_episodes} Episodes`
      : "";
    title = tvShow.name!;
    season = tvShow.number_of_seasons || 0;
    numberOfSeasons = tvShow.number_of_seasons || 1;
  } else {
    let movie = data as MovieDetails;
    title = movie.title!;

    if (movie.runtime) {
      let _hr = (movie.runtime / 60).toFixed();
      let _min = movie.runtime % 60;
      runtime = `${_hr}h ${_min}min`;
    }
  }
  const videos = data.videos.results!.length >= 1 ? data.videos.results : null;
  const isInList = myList.filter((item) => item.id === data.id!).length > 0;

  if (crew) {
    if (category === "movie") {
      for (const member of crew) {
        if (member.job === "Director") director.push(member);
      }
    } else {
      // TODO
      for (const member of crew) {
        if (member.job === "Executive Producer") director.push(member);
      }
    }
    if (!director.length) director = "TBA";
  }

  return (
    <AnimatePresence>
      {!isExpanded ? (
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "tween", duration: 0.2 }}
          style={{ top: y, left: x }}
          className={styles["mini-modal-container"]}
          // onPointerLeave={() => setModalState({ visible: false })}>
        >
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
              <div className={styles["player-controls"]}>
                <button
                  className={styles["mute-btn"]}
                  onClick={() => setIsMuted(!muted)}>
                  {muted ? <SoundOff /> : <SoundHigh />}
                </button>
              </div>
            </div>
          ) : (
            <img src={api.getBackdropURL(data.backdrop_path)} alt="" />
          )}
          <div className={styles["mini-modal-info-container"]}>
            <div className={styles["mini-modal-menu"]}>
              <button className={styles["play-btn"]}>
                <PlayOutline />
              </button>
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
              <button>
                <ThumbsUp />
              </button>
              <button onClick={() => setIsExpanded(true)}>
                <NavArrowDown />
              </button>
            </div>
            <div className={styles["details"]}>
              <h2>{title}</h2>
              <span className={styles["span-match"]}>69% match</span>
              {season > 1 && <span>{`${season} Seasons`}</span>}
              {runtime && (
                <span className={styles["span-runtime"]}>{runtime}</span>
              )}
            </div>
            <div className={styles["genres"]}>
              {data.genres?.map((genre) => (
                <span key={genre.id}>
                  <span>{genre.name}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <Backdrop
          className={styles.backdrop}
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setModalState({ visible: false });
            }
          }}>
          <div className={styles["big-modal-container"]}>
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
                <div className={styles["player-controls"]}>
                  <div className={styles["player-menu"]}>
                    <button className={styles["play-btn"]}>
                      <PlayOutline />
                      <span>Play</span>
                    </button>
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
                    <button>
                      <ThumbsUp />
                    </button>
                  </div>
                  <button
                    className={styles["mute-btn"]}
                    onClick={() => setIsMuted(!muted)}>
                    {muted ? <SoundOff /> : <SoundHigh />}
                  </button>
                </div>
              </div>
            ) : (
              <img src={api.getBackdropURL(data.backdrop_path)} alt="" />
            )}
            <div className={styles["big-modal-info-container"]}>
              <div className={styles["big-modal-info-details"]}>
                <div className={styles["big-modal-info-details__left"]}>
                  <h2>{title}</h2>
                  <span className={styles["span-match"]}>69% match</span>
                  {season > 1 && <span>{`${season} Seasons`}</span>}
                  {runtime && (
                    <span className={styles["span-runtime"]}>{runtime}</span>
                  )}
                  {data.overview && <p>{data.overview}</p>}
                </div>
                <div className={styles["big-modal-info-details__right"]}>
                  {Array.isArray(starring) && (
                    <div>
                      <span className={styles.title}>Cast: </span>
                      {starring.map((star, idx) => {
                        return (
                          <span>
                            {star.name}
                            {starring.length - 1 !== idx && ", "}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {/* // TODO simplify checks */}
                  {Array.isArray(data.genres) && (
                    <div>
                      <span className={styles.title}>Genre: </span>
                      {data.genres.map((genre, idx) => (
                        <span>
                          {genre.name}
                          {data.genres!.length - 1 !== idx && ", "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles["sections"]}>
                <div className={styles["episodes-section"]}>
                  <EpisodeSelector
                    id={+id}
                    seasons={numberOfSeasons}
                    showHeading={true}
                  />
                </div>
                <div className={styles["recommendation-section"]}>
                  <h2>More Like This</h2>
                  <Slider
                    endpoint={`${category}/${id}/recommendations`}
                    flow="row"
                  />
                </div>
                {videos && (
                  <div className={styles["trailers-section"]}>
                    <h2>Trailer & More</h2>
                    <div className={styles["video-frames"]}>
                      {videos.map((video) => {
                        return (
                          <VideoFrame
                            key={video.key!}
                            videoKey={video.key!}
                            title={video.name!}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles["big-modal-info-about"]}>
                <h2>
                  About <span>{title}</span>
                </h2>
                {Array.isArray(director) && (
                  <div>
                    <span className={styles.title}>
                      {category === "tv" ? "Creators: " : "Director: "}
                    </span>
                    {director.map((crew, idx) => (
                      <span>
                        {crew.name}
                        {director!.length - 1 !== idx && ", "}
                      </span>
                    ))}
                  </div>
                )}
                {Array.isArray(cast) && (
                  <div>
                    <span className={styles.title}>Cast: </span>
                    {cast.map((star, idx) => {
                      return (
                        <span>
                          {star.name}
                          {starring.length - 1 !== idx && ", "}
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* // TODO simplify checks */}
                {Array.isArray(data.genres) && (
                  <div>
                    <span className={styles.title}>Genre: </span>
                    {data.genres.map((genre, idx) => (
                      <span>
                        {genre.name}
                        {data.genres!.length - 1 !== idx && ", "}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default DesktopInfoModal;
