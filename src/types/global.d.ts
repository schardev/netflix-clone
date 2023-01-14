/// <reference types="vite/client" />

type Category = "movie" | "tv" | "person";
type MyList = {
  id: number;
  poster_path: string;
  media_type: Category;
};
