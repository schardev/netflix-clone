import { Play } from "iconoir-react";
import useMediaQuery from "../hooks/useMediaQuery";

type VideoFrameProps = {
  title: string;
  videoKey: string;
  size?: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";
};

// https://stackoverflow.com/a/71639812
const VideoFrame = ({
  title,
  videoKey,
  size = "mqdefault",
}: VideoFrameProps) => {
  const tabletUp = useMediaQuery("tablet-up");
  if (tabletUp) size = "hqdefault";

  return (
    <div className="video-frame">
      <a
        href={`https://www.youtube.com/watch?v=${videoKey}`}
        target="_blank"
        rel="noreferrer">
        <div className="video-frame__img">
          <img src={`https://i.ytimg.com/vi/${videoKey}/${size}.jpg`} />
          <Play />
        </div>
      </a>
      <span className="video-frame__title">{title}</span>
    </div>
  );
};

export default VideoFrame;
