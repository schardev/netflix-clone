import { forwardRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

type YouTubeIFrameProps = ReactPlayerProps & {
  videoKey: string;
  autoplay?: boolean;
};

const YouTubeIFrame = forwardRef<ReactPlayer, YouTubeIFrameProps>(
  function YouTubeIFrame({ videoKey, autoplay, ...props }, ref) {
    const YT_URL = "https://www.youtube.com/watch?v=";

    if (!videoKey) {
      console.error("Video key not provided!");
      return null;
    }

    // https://github.com/cookpete/react-player/issues/1119
    const videoURL = YT_URL + videoKey;
    return (
      <div className="yt-player">
        {/* https://stackoverflow.com/questions/48399390/youtube-embed-autoplay-on-mobile */}
        <ReactPlayer
          ref={ref}
          url={videoURL}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: {
                autoplay: autoplay ? 1 : 0, // autoplay, but only works on desktop
                modestbranding: 1, // prevent the YouTube logo from displaying in the control bar
                iv_load_policy: 3, // disable video annotations
                rel: 0, // only show related videos from the channel only
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
