import { motion, Variants } from "framer-motion";
import {
  Check,
  DeleteCircle,
  InfoEmpty,
  NavArrowRight,
  Play,
  Plus,
  ShareAndroid,
} from "iconoir-react";
import { Link, useNavigate } from "react-router-dom";
import { useModalDispatcher } from "../contexts/ModalContext";
import { useMyListData, useMyListDispatcher } from "../contexts/MyListProvider";
import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/mobile-modal.module.scss";
import type { MediaType } from "../types/app";
import type { MovieDetails, TVDetails } from "../types/tmdb";
import { shareLink } from "../utils";
import Backdrop from "./Backdrop";
import Portal from "./Portal";

type MobileInfoModalProps = {
  category: Exclude<MediaType, "person">;
  id: number;
};

const modalVariants: Variants = {
  initial: { y: 50 },
  animate: { y: 0 },
  exit: { y: "100%", transition: { stiffness: 100 } },
};

const MobileInfoModal = ({ category, id }: MobileInfoModalProps) => {
  const { isInList } = useMyListData();
  const dispatchToList = useMyListDispatcher();
  const setModalState = useModalDispatcher();
  const navigate = useNavigate();
  const { isLoading, data } = useFetch<MovieDetails | TVDetails>(
    `${category}/${id}`,
    ({ signal }) => {
      return api.makeRequest(`${category}/${id}`, {
        init: { signal },
      });
    }
  );

  if (!data || isLoading) return null;
  const closeModal = () => setModalState({ visible: false });

  let releaseYear: number | string = "";
  let runtime = "";
  let title = "";
  let season = 0;

  if (category === "tv") {
    const tvShow = data as TVDetails;
    releaseYear = tvShow.first_air_date
      ? new Date(tvShow.first_air_date!).getFullYear()
      : "TBA";
    runtime = tvShow.number_of_episodes
      ? `${tvShow.number_of_episodes} Episodes`
      : "";
    title = tvShow.name!;
    season = tvShow.number_of_seasons || 0;
  } else {
    const movie = data as MovieDetails;
    releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : "";
    title = movie.title!;

    if (movie.runtime) {
      const _hr = (movie.runtime / 60).toFixed();
      const _min = movie.runtime % 60;
      runtime = `${_hr}h ${_min}min`;
    }
  }

  const handleListClick = () => {
    dispatchToList({
      type: "add",
      payload: {
        id: data.id!,
        media_type: category,
        poster_path: api.getPosterURL(data.poster_path),
      },
    });
  };

  return (
    <Portal>
      <Backdrop
        onClick={(e) => {
          if (e.currentTarget === e.target) setModalState({ visible: false });
        }}>
        <motion.div
          className={styles["modal-container"]}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit">
          <div className={styles["modal-info"]}>
            <div className={styles["modal-info__img"]}>
              <img src={api.getPosterURL(data.poster_path!)} />
            </div>
            <div className={styles["modal-info__details"]}>
              <h4>{title}</h4>
              {releaseYear && <span>{releaseYear}</span>}
              {season > 1 && <span>{`${season} Seasons`}</span>}
              {runtime && <span>{runtime}</span>}
              <p>{data.overview ? data.overview : "TBA"}</p>
            </div>
          </div>
          <div className={styles["modal-menu"]}>
            <ul>
              <li>
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/${category}/${data.id!}`);
                  }}>
                  <div className={styles["modal-icon"]}>
                    <Play />
                  </div>
                  <span>Play</span>
                </button>
              </li>
              <li>
                <button onClick={handleListClick}>
                  <div className={styles["modal-icon"]}>
                    {isInList(data.id!, category) ? <Check /> : <Plus />}
                  </div>
                  <span>My List</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    shareLink({
                      url: `${window.location.origin}/${category}/${id}`,
                    })
                  }>
                  <div className={styles["modal-icon"]}>
                    <ShareAndroid />
                  </div>
                  <span>Share</span>
                </button>
              </li>
            </ul>
          </div>
          <div className={styles["modal-more"]}>
            <Link to={`/${category}/${data.id!}`} onClick={closeModal}>
              <InfoEmpty />
              <p>
                {category === "movie" ? "Details & More" : "Episodes & Info"}
              </p>
              <NavArrowRight />
            </Link>
          </div>
          <button className={styles["modal-close-btn"]} onClick={closeModal}>
            <DeleteCircle />
          </button>
        </motion.div>
      </Backdrop>
    </Portal>
  );
};

export default MobileInfoModal;
