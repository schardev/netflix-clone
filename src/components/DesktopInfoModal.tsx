import {
  Check,
  NavArrowDown,
  Play,
  Plus,
  SoundHigh,
  SoundOff,
  ThumbsUp,
} from "iconoir-react";
import { useState } from "react";
import { useModalDispatcher } from "../contexts/ModalContext";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/desktop-info-modal.module.scss";
import type { MediaType } from "../types/app";
import type {
  Credits,
  Images,
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
} & { images: Images };

type DesktopInfoModalProps = {
  category: Exclude<MediaType, "person">;
  id: number;
  x: number;
  y: number;
  expanded?: boolean;
};

const DesktopInfoModal = ({
  category,
  id,
  x,
  y,
  expanded = false,
}: DesktopInfoModalProps) => {
  const { isInList } = useMyListData();
  const dispatchToList = useMyListDispatcher();
  const setModalState = useModalDispatcher();
  const [muted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { data, isLoading } = useFetch(
    `${category}/${id}/desktopmodal`,
    ({ signal }) => {
      return api.makeRequest<ExtendedRequest<MovieDetails | TVDetails>>(
        `${category}/${id}`,
        {
          query: {
            append_to_response: "videos,credits,recommendations,images",
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
  let starring = cast ? cast.slice(0, 4) : [];
  let director: Credits["crew"] | string = [];

  let logoPath: string | null = null;
  if (data.images?.logos && data.images.logos[0]) {
    logoPath = data.images.logos[0].file_path!;
  }

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
  const addToList = () =>
    dispatchToList({
      type: "add",
      payload: {
        id: data.id!,
        media_type: category,
        poster_path: api.getPosterURL(data.poster_path),
      },
    });

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

  const details = (
    <div
      className={
        isExpanded
          ? styles["big-modal-info-details__left"]
          : styles["mini-modal-info-details"]
      }>
      <h2>{title}</h2>
      <span className={styles["span-match"]}>69% match</span>
      {season > 1 && <span>{`${season} Seasons`}</span>}
      {runtime && <span className={styles["span-runtime"]}>{runtime}</span>}
      {isExpanded && data.overview && <p>{data.overview}</p>}
    </div>
  );

  const buttons = (
    <div
      className={
        isExpanded ? styles["big-player-menu"] : styles["mini-player-menu"]
      }>
      <button className={styles["play-btn"]}>
        <Play />
        {isExpanded && <span>Play</span>}
      </button>
      <button onClick={addToList}>
        {isInList(data.id!, category) ? <Check /> : <Plus />}
      </button>
      <button>
        <ThumbsUp />
      </button>
      {!isExpanded && (
        <button onClick={() => setIsExpanded(true)}>
          <NavArrowDown />
        </button>
      )}
    </div>
  );

  return (
    <Backdrop
      layout
      initial={{ opacity: 0.5, scale: 0.7, backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        opacity: 1,
        scale: 1,
        ...(isExpanded
          ? { backgroundColor: "rgba(0,0,0,0.7)", transition: { delay: 0.3 } }
          : {}),
      }}
      transition={{ type: "tween", duration: 0.3 }}
      exit={{ opacity: 0 }}
      style={!isExpanded ? { top: y, left: x } : {}}
      preventScroll={isExpanded}
      onClick={(e) => {
        if (e.currentTarget === e.target && isExpanded) {
          setModalState({ visible: false });
        }
      }}
      className={
        !isExpanded ? styles["mini-motion-modal"] : styles["big-motion-modal"]
      }>
      <div
        className={
          isExpanded
            ? styles["big-modal-container"]
            : styles["mini-modal-container"]
        }>
        {videos ? (
          <div className={styles["player"]}>
            <YouTubeIFrame
              videoKey={videos[0].key!}
              playing={true}
              controls={true}
              muted={muted}
              loop={true}
            />
            {isExpanded && logoPath && (
              <div className={styles.logo}>
                <img src={api.getLogoURL(logoPath)} alt="" />
              </div>
            )}
            <div className={styles["player-controls"]}>
              {isExpanded && buttons}
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
        {!isExpanded ? (
          <div className={styles["mini-modal-info-container"]}>
            {buttons}
            {details}
            <div className={styles["genre-list"]}>
              {data.genres?.map((genre) => (
                <span key={genre.id}>
                  <span>{genre.name}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles["big-modal-info-container"]}>
            <div className={styles["big-modal-info-details"]}>
              {details}
              <div className={styles["big-modal-info-details__right"]}>
                {/* // TODO simplify checks */}
                {Array.isArray(starring) && starring.length > 0 && (
                  <div>
                    <span className={styles["span-title"]}>Cast: </span>
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
                {Array.isArray(data.genres) && (
                  <div>
                    <span className={styles["span-title"]}>Genre: </span>
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
              {data.recommendations.results!.length > 0 && (
                <div className={styles["recommendation-section"]}>
                  <h2>More Like This</h2>
                  <Slider
                    endpoint={`${category}/${id}/recommendations`}
                    flow="row"
                  />
                </div>
              )}
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
                  <span className={styles["span-title"]}>
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
                  <span className={styles["span-title"]}>Cast: </span>
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
              {Array.isArray(data.genres) && (
                <div>
                  <span className={styles["span-title"]}>Genre: </span>
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
        )}
      </div>
    </Backdrop>
  );
};

export default DesktopInfoModal;
