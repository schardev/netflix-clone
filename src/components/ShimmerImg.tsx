import { useRef } from "react";

type ShimmerImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

const ShimmerImg = (props: ShimmerImgProps) => {
  const placeholderRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={placeholderRef} className="shimmer"></div>
      <img
        {...props}
        onLoad={() => {
          placeholderRef.current?.remove();
        }}
      />
    </>
  );
};

export default ShimmerImg;
