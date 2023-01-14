import type { ModalCategory } from "./contexts/ModalContext";
import type { MovieDetails } from "./types/tmdb";

export const j = (...classNames: (string | undefined)[]) => {
  return classNames.filter(Boolean).join(" ");
};

export const copyToClipboard = async (text: string) => {
  try {
    // `writeText()` returns promise that resolves if successfully copied to
    // clipboard otherwise rejects if we don't have permissions
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

export const shareLink = (opts: Omit<ShareData, "files">) => {
  // TODO: handle exceptions (@see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#exceptions)
  if (typeof navigator.share === "function") {
    navigator.share(opts);
  } else {
    // Unfortunately Firefox doesn't support `share()` api
    if (opts.url) {
      copyToClipboard(opts.url);
    }
  }
};

export const getMovieInfoFromData = (data: MovieDetails) => {
  let title = data.title!;
  let releaseYear = data.release_date
    ? new Date(data.release_date).getFullYear()
    : null;

  let runtime: string | null = null;
  if (data.runtime) {
    let _hr = (data.runtime / 60).toFixed();
    let _min = data.runtime % 60;
    runtime = `${_hr}h ${_min}min`;
  }

  return { releaseYear, runtime, title };
};

type MyList = {
  [key in ModalCategory]: { [id: number]: string };
};

export const getItemFromLocalStorage = (
  category: ModalCategory,
  id: number
) => {
  const myList = window.localStorage.getItem("my-list");
  const localStorage: MyList | null = myList ? JSON.parse(myList) : null;
  if (!localStorage) return -1;
  return localStorage[category] ? localStorage[category][id] : -1;
};

export const addToList = (
  category: ModalCategory,
  id: number,
  posterPath: string
) => {
  const isAlreadyAdded = getItemFromLocalStorage(category, id);
  if (isAlreadyAdded !== -1) return;

  const myList = window.localStorage.getItem("my-list");
  const localStorage: MyList | null = myList ? JSON.parse(myList) : null;

  if (!localStorage) {
    let list = {} as MyList;
    list[category] = {};
    list[category][id] = posterPath;
    window.localStorage.setItem("my-list", JSON.stringify(list));
  } else {
    if (!localStorage[category]) localStorage[category] = {};
    localStorage[category][id] = posterPath;
    window.localStorage.setItem("my-list", JSON.stringify(localStorage));
  }
};
