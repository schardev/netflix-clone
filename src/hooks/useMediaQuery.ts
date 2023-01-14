import { useEffect, useState } from "react";
import scssVars from "../styles/exports.module.scss";

type MediaQuery = keyof typeof scssVars;

// slightly modified useMediaQuery hook taken from usehooks-ts
// @see https://usehooks-ts.com/react-hook/use-media-query
const useMediaQuery = (query: MediaQuery) => {
  const mediaQueries = scssVars;
  const queryWithParenthesis = `(${mediaQueries[query].replaceAll('"', "")})`;

  const getMatches = (query: MediaQuery) => {
    // passing empty string to `matchMedia` actually returns true
    if (queryWithParenthesis) {
      return window.matchMedia(queryWithParenthesis).matches;
    }

    console.error("Invalid media query: ", query);
    return false;
  };

  const [matches, setMatches] = useState(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(queryWithParenthesis);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
