import { forwardRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import styles from "../styles/infopage.module.scss";

type YouTubeIFrameProps = ReactPlayerProps & { videoKey: string };

const YouTubeIFrame = forwardRef<ReactPlayer, YouTubeIFrameProps>(
  ({ videoKey, ...props }, ref) => {
    const YT_URL = "https://www.youtube.com/watch?v=";

    if (!videoKey) {
      console.error("Video key not provided!");
      return null;
    }

    // https://github.com/cookpete/react-player/issues/1119
    const videoURL = YT_URL + videoKey;
    return (
      <div className={styles["yt-player"]}>
        {/* https://stackoverflow.com/questions/48399390/youtube-embed-autoplay-on-mobile */}
        <ReactPlayer
          ref={ref}
          url={videoURL}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                iv_load_policy: 3,
              },
            },
          }}
          {...props}
        />
      </div>
    );
  }
);

export default YouTubeIFrame;
