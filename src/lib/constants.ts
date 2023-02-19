export const TMDB_CONFIG = {
  images: {
    base_url: "http://image.tmdb.org/t/p/",
    secure_base_url: "https://image.tmdb.org/t/p/",
    backdrop_sizes: ["w300", "w780", "w1280", "original"],
    logo_sizes: ["w45", "w92", "w154", "w185", "w300", "w500", "original"],
    poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
    profile_sizes: ["w45", "w185", "h632", "original"],
    still_sizes: ["w92", "w185", "w300", "original"],
  },
} as const;

export const MOVIE_GENRE = {
  ADVENTURE: 12,
  FANTASY: 14,
  ANIMATION: 16,
  DRAMA: 18,
  HORROR: 27,
  ACTION: 28,
  COMEDY: 35,
  HISTORY: 36,
  WESTERN: 37,
  THRILLER: 53,
  CRIME: 80,
  DOCUMENTARY: 99,
  SCIENCE_FICTION: 878,
  MYSTERY: 9648,
  MUSIC: 10402,
  ROMANCE: 10749,
  FAMILY: 10751,
  WAR: 10752,
  TV_MOVIE: 10770,
} as const;

export const TV_GENRE = {
  ANIMATION: 16,
  DRAMA: 18,
  COMEDY: 35,
  WESTERN: 37,
  CRIME: 80,
  DOCUMENTARY: 99,
  MYSTERY: 9648,
  FAMILY: 10751,
  ACTION_ADVENTURE: 10759,
  KIDS: 10762,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
} as const;

/* Genre list entries */
const splitJoin = (str: string) => {
  // doing lowercase since we'll properly capitalize them using css
  return str.split("_").join(" ").toLowerCase();
};

export const movieGenreEntries = {
  title: "MOVIES",
  list: Object.entries(MOVIE_GENRE).map((genre) => {
    return {
      text: splitJoin(genre[0]),
      link: `/genres/movie/${genre[1]}`,
    };
  }),
};

export const tvGenreEntries = {
  title: "TV",
  list: Object.entries(TV_GENRE).map((genre) => {
    return {
      text: splitJoin(genre[0]),
      link: `/genres/tv/${genre[1]}`,
    };
  }),
};
