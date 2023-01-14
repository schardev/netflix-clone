import { PlayOutline } from "iconoir-react";
import ShimmerImg from "./ShimmerImg";

type VideoFrameProps = {
  title: string;
  videoKey: string;
  size?: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";
};

// https://stackoverflow.com/a/71639812
const VideoFrame = ({ title, videoKey, size }: VideoFrameProps) => {
  if (!size) {
    // TODO: change according to viewport context
    size = "hqdefault";
  }

  return (
    <div className="video-frame">
      <a href={`https://www.youtube.com/watch?v=${videoKey}`} target="_blank">
        <div className="video-frame__img">
          <ShimmerImg src={`https://i.ytimg.com/vi/${videoKey}/${size}.jpg`} />
          <PlayOutline/>
        </div>
      </a>
      <span className="video-frame__title">{title}</span>
    </div>
  );
};

export default VideoFrame;
