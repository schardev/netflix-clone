import { useState, useRef, useCallback } from "react";

const useIntersectionObserver = <T extends HTMLElement>({
  threshold = 0.5,
  root,
  rootMargin,
  once = false,
}: {
  once?: boolean;
} & IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<T | null>(null);
  const setRef = useCallback((node: T | null) => {
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

        // Immediately unobserve target if we're running it only once
        if (entry.isIntersecting && once) {
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin, root }
    )
  );

  return { ref, setRef, isIntersecting };
};

export default useIntersectionObserver;
