import {
  PauseOutline,
  PlayOutline,
  Plus,
  ShareAndroid,
  ThumbsUp,
} from "iconoir-react";
import { useRef, useState } from "react";
import type ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import EpisodeSelector from "../components/EpisodeSelector";
import Slider from "../components/Slider";
import Spinner from "../components/Spinner";
import {
  TabsContainer,
  TabPanel,
  TabList,
  TabListContainer,
  TabPanelContainer,
} from "../components/Tabs";
import VideoFrame from "../components/VideoFrame";
import YouTubeIFrame from "../components/YouTubeIFrame";
import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/infopage.module.scss";
import type {
  Credits,
  ListResponse,
  MovieDetails,
  TVDetails,
  Videos,
} from "../types/tmdb";
import { shareLink } from "../utils";

type ExtendedRequest<T> = T & { videos: Videos } & { credits: Credits } & {
  recommendations: ListResponse<T>;
};

const InfoPage = () => {
  const { category, id } = useParams();
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  if ((category !== "movie" && category !== "tv") || !id) {
    // TODO: throw not found
    console.error("Invalid category route or id provided!", category, id);
    return null;
  }

  const { error, data, isLoading } = useFetch(
    `${category}/${id}/infopage`,
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

  if (error) console.error(error);
  if (isLoading) return <Spinner />;
  if (!data) return null;

  // Extract necessary details from response
  // TODO: break this into utility function
  let title: string;
  let releaseDate: number | string;
  let runtime: string = "TBA";
  let season: number | null = null;
  const cast = data.credits.cast;
  const crew = data.credits.crew;
  const recommendations = data.recommendations.results ?? [];
  const videos = data.videos.results!.length >= 1 ? data.videos.results : null;
  let starring = cast ? cast.slice(0, 4) : "TBA";
  let director: Credits["crew"] | string = [];
  let numberOfSeasons = 1;

  if (category === "movie") {
    const movieData = data as ExtendedRequest<MovieDetails>;
    title = movieData.title ? movieData.title : "TBA";
    releaseDate = new Date(movieData.release_date!).getFullYear() || "TBA";
    if (movieData.runtime) {
      let _hr = (movieData.runtime / 60).toFixed();
      let _min = movieData.runtime % 60;
      runtime = `${_hr}h ${_min}min`;
    }
  } else {
    const tvData = data as ExtendedRequest<TVDetails>;
    title = tvData.name ? tvData.name : "TBA";
    releaseDate = new Date(tvData.first_air_date!).getFullYear() || "TBA";
    runtime = tvData.number_of_episodes
      ? `${tvData.number_of_episodes} Episodes`
      : "TBA";
    season = tvData.number_of_seasons || null;
    numberOfSeasons = tvData.number_of_seasons || 1;
  }

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
    <main className={styles.main}>
      {videos && (
        <YouTubeIFrame
          ref={playerRef}
          videoKey={videos[0].key!}
          playing={playing}
          controls={true}
          onError={() => {
            console.log("error playing video");
          }}
          onPlay={() => {
            const currentPlayer = playerRef.current!.getInternalPlayer();
            const iframe = currentPlayer.getIframe();

            // Request full screen since we are essentially 'hiding' the controls
            // on portrait mode
            (iframe as HTMLIFrameElement).requestFullscreen().then(() => {
              // screen can only be locked once full screen
              // TODO: check iOS support
              window.screen.orientation.lock("landscape");
            });
          }}
        />
      )}
      <section className={styles["info-section"]}>
        <div className={styles["info-section__title"]}>
          <h2>{title}</h2>
          <span>{releaseDate}</span>
          {season && <span>{`${season} Seasons`}</span>}
          <span>{runtime}</span>
        </div>
        {videos && (
          <button
            className={styles["info-section__play-btn"]}
            onClick={() => setPlaying(!playing)}>
            {playing ? <PauseOutline /> : <PlayOutline />}
            <span>{playing ? "Pause" : "Play"}</span>
          </button>
        )}
        <p>{data.overview}</p>
        <div className={styles["info-section__team"]}>
          <ul>
            <span>Starring:</span>
            {Array.isArray(starring) ? (
              starring.map((cast, idx) => (
                <li key={cast.id}>
                  {cast.name}
                  {starring.length - 1 !== idx && ", "}
                </li>
              ))
            ) : (
              <li>starring</li>
            )}
          </ul>
          <ul>
            <span>{category === "movie" ? "Director:" : "Creator:"}</span>
            {Array.isArray(director) ? (
              director.map((crew, idx) => (
                <li key={crew.id}>
                  {crew.name}
                  {director!.length - 1 !== idx && ", "}
                </li>
              ))
            ) : (
              <li>{director}</li>
            )}
          </ul>
        </div>
        <div className={styles["info-section__actions"]}>
          <button>
            <Plus />
            <span>My List</span>
          </button>
          <button>
            <ThumbsUp />
            <span>Rate</span>
          </button>
          <button
            onClick={() =>
              shareLink({
                // TODO: useLocation/useNavigation
                url: `${window.location.origin}/${category}/${id}`,
              })
            }>
            <ShareAndroid />
            <span>Share</span>
          </button>
        </div>
      </section>
      <div className={styles["tabs-container"]}>
        <TabsContainer>
          <TabListContainer>
            {category === "tv" && (
              <TabList id="episodes-tab">
                <button>Episodes</button>
              </TabList>
            )}
            {/* TODO: Recommendation could be empty && make a generic slider
              that takes just the result object */}
            {recommendations.length > 0 && (
              <TabList id="recommendations-tab">
                <button>More Like This</button>
              </TabList>
            )}
            {videos && (
              <TabList id="trailers-tab">
                <button>Trailers & More</button>
              </TabList>
            )}
          </TabListContainer>
          <TabPanelContainer>
            {category === "tv" && (
              <TabPanel value="episodes-tab">
                <EpisodeSelector id={+id} seasons={numberOfSeasons} />
              </TabPanel>
            )}
            {recommendations.length > 0 && (
              <TabPanel value="recommendations-tab">
                <Slider
                  endpoint={`${category}/${+id}/recommendations`}
                  flow="row"
                />
              </TabPanel>
            )}
            {videos && (
              <TabPanel value="trailers-tab">
                {videos.map((video) => {
                  return (
                    <VideoFrame videoKey={video.key!} title={video.name!} />
                  );
                })}
              </TabPanel>
            )}
          </TabPanelContainer>
        </TabsContainer>
      </div>
    </main>
  );
};

export default InfoPage;
