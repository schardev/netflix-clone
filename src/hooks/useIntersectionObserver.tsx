import { useState, useRef, useCallback } from "react";

const useIntersectionObserver = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement | null>();
  const setRef = useCallback((node: HTMLElement | null) => {
    if (ref.current) {
      observer.current.disconnect();
    }
    if (node) {
      observer.current.observe(node);
    }
    ref.current = node;
  }, []);

  const observer = useRef(
    new IntersectionObserver(
      ([entry], observer) => {
        setIsIntersecting(entry.isIntersecting);

        // Immediately unobserve target if intersecting to avoid running callback
        // any further
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    )
  );

  return [setRef, isIntersecting] as const;
};

export default useIntersectionObserver;
