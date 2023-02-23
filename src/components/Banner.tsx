import {
  Check,
  InfoEmpty,
  Pause,
  Play,
  Plus,
  SoundHigh,
  SoundOff,
} from "iconoir-react";
import { PropsWithChildren, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalCategory, useModalDispatcher } from "../contexts/ModalContext";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import useFetch from "../hooks/useFetch";
import useMediaQuery from "../hooks/useMediaQuery";
import { api } from "../lib/tmdb";
import styles from "../styles/banner.module.scss";
import type {
  BackdropSizes,
  CustomURLSearchParams,
  Images,
  LogoSizes,
  MovieDetails,
  TVDetails,
  Videos,
} from "../types/tmdb";
import { j } from "../utils";
import YouTubeIFrame from "./YouTubeIFrame";

type BannerState =
  | ((MovieDetails | TVDetails) & { images: Images; videos: Videos })
  | null;

const BannerShimmer = () => {
  return (
    <div className={j(styles["banner-shimmer"])}>
      <div className="shimmer"></div>
      <div className="shimmer"></div>
    </div>
  );
};

const Banner = ({
  endpoint,
  params = {},
}: PropsWithChildren<{ endpoint: string; params?: CustomURLSearchParams }>) => {
  const searchParams = new URLSearchParams(params as unknown as string);

  let category: Exclude<ModalCategory, "list">;
  if (endpoint.includes("movie")) {
    category = "movie";
  } else if (endpoint.includes("tv")) {
    category = "tv";
  } else {
    throw new Error("Unknown endpoint!");
  }

  const { isInList } = useMyListData();
  const dispatchToList = useMyListDispatcher();
  const setModalState = useModalDispatcher();
  const navigate = useNavigate();
  const tabletUp = useMediaQuery("tablet-up");
  const desktopUp = useMediaQuery("desktop-up");
  const { isLoading, data, error } = useFetch<BannerState>(
    `${endpoint}/${searchParams}/banner`,
    async ({ signal }) => {
      const res = await api.makeRequest(endpoint, {
        query: params,
        init: { signal },
      });

      const randomItemId =
        res.results[Math.floor(Math.random() * res.results.length)].id;

      const item = await api.makeRequest(`${category}/${randomItemId}`, {
        query: {
          language: "en",
          append_to_response: "images,videos",
          ...params,
        },
        init: { signal },
      });

      return item;
    }
  );

  // storing the videoKey makes sure we don't load a new video on every state
  // change via mute/play toggle
  const videoKey = useRef("");
  const [{ playing, muted, showPlayer }, setPlayerState] = useState({
    playing: false,
    muted: true,
    showPlayer: tabletUp,
  });

  if (error) {
    console.error(error);
    return null;
  }

  if (!data || isLoading) return <BannerShimmer />;

  let title: string;
  if (category === "movie") {
    title = (data as MovieDetails).title!;
  } else {
    title = (data as TVDetails).name!;
  }

  const logoSize: LogoSizes = desktopUp ? "w500" : tabletUp ? "w300" : "w185";
  const backdropSize: BackdropSizes = tabletUp ? "w1280" : "w780";
  let logoPath: string | null = null;
  if (data?.images.logos && data.images.logos[0]) {
    logoPath = data.images.logos[0].file_path!;
  }

  const videos = data.videos.results!.length >= 1 ? data.videos?.results : null;
  if (videos && !videoKey.current) {
    // randomly select any video key
    videoKey.current = videos[Math.floor(videos.length * Math.random())].key!;
  }

  const handleAddList = () => {
    dispatchToList({
      type: "add",
      payload: {
        id: data.id!,
        media_type: category,
        poster_path: api.getPosterURL(data.poster_path),
      },
    });
  };

  const handlePlayerReady = () => {
    // start player after a slight delay only if the player is visible
    // and we aren't already playing it
    setTimeout(() => {
      if (!playing) {
        setPlayerState((p) => ({ ...p, playing: p.showPlayer }));
      }
    }, 6000);
  };

  const handlePlayerError = () => {
    // revert back to showing banner if failed to play the video
    console.error("error playing video");
    setPlayerState((p) => ({
      ...p,
      playing: false,
      showPlayer: false,
    }));
  };

  const handlePlayButtonClick = () => {
    if (showPlayer) {
      setPlayerState((p) => ({ ...p, playing: !p.playing }));
    } else if (!tabletUp) {
      navigate(`/${category}/${data.id}`);
    }
  };

  const handleInfoClick = () => {
    setPlayerState((p) => ({ ...p, playing: false }));
    setModalState({
      visible: true,
      id: data.id!,
      category: category,
      expanded: true,
    });
  };

  return (
    <div className={styles["banner-container"]}>
      {videoKey.current && showPlayer && (
        <div
          className={styles["player"]}
          style={{ opacity: playing ? "1" : "0" }}>
          <YouTubeIFrame
            videoKey={videoKey.current}
            playing={playing}
            loop={true}
            muted={muted}
            onReady={handlePlayerReady}
            onError={handlePlayerError}
          />
          <div
            className={styles["player-control"]}
            onClick={() => setPlayerState((p) => ({ ...p, muted: !p.muted }))}>
            {muted ? <SoundOff /> : <SoundHigh />}
          </div>
        </div>
      )}
      <div className={j(styles["banner-img"])}>
        <img
          src={api.getBackdropURL(data.backdrop_path, backdropSize)}
          alt={(data as any).title || (data as any).name}
          onLoad={(e) => (e.currentTarget.style.opacity = "1")}
        />
      </div>
      <div className={styles["banner-info"]}>
        {logoPath ? (
          <img
            className={styles["banner-info__logo"]}
            src={api.getLogoURL(logoPath, logoSize)}
            alt=""
            onLoad={(e) => (e.currentTarget.style.opacity = "1")}
          />
        ) : (
          <h1>{title}</h1>
        )}
        {tabletUp ? (
          <p>{data.overview}</p>
        ) : (
          <ul className={styles["banner-info__genre"]}>
            {data.genres?.map((genre) => (
              <li key={genre.id}>
                <span>{genre.name}</span>
              </li>
            ))}
          </ul>
        )}
        <ul className={styles["banner-menu"]}>
          {!tabletUp && (
            <li>
              <button onClick={handleAddList}>
                {isInList(data.id!, category) ? <Check /> : <Plus />}
                <span>My List</span>
              </button>
            </li>
          )}
          <li>
            <button
              className={styles["play-btn"]}
              onClick={handlePlayButtonClick}>
              {playing ? <Pause /> : <Play />}
              <span>{playing ? "Pause" : "Play"}</span>
            </button>
          </li>
          <li>
            <button onClick={handleInfoClick}>
              <InfoEmpty />
              <span>{tabletUp ? "More Info" : "Info"}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Banner;
