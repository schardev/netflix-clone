import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Form } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { api } from "../lib/tmdb";
import styles from "../styles/episode-selector.module.scss";
import type { TVSeasons } from "../types/tmdb";

const EpisodeSelector = ({
  id,
  seasons = 1,
  showHeading = false,
}: {
  id: number;
  seasons?: number;
  showHeading?: boolean;
}) => {
  const [query, setQuery] = useState(1);
  const { data } = useFetch<TVSeasons>(
    `tv/${id}/season/${query}`,
    ({ signal }) => {
      return api.makeRequest(`tv/${id}/season/${query}`, {
        init: { signal },
      });
    }
  );

  if (!data) return null;

  const handleChange: React.FormEventHandler<HTMLFormElement> = (e) => {
    const target = e.currentTarget;
    const formData = new FormData(target);
    const seasonNumber = formData.get("season") as string;
    if (seasonNumber) setQuery(+seasonNumber);
  };

  return (
    <div className={styles["episode-selector"]}>
      <div className={styles["episode-selector__header"]}>
        {showHeading && <h2>Episodes</h2>}
        {seasons > 1 && (
          <Form onChange={handleChange} className={styles["season-selector"]}>
            <select defaultValue={query} name="season">
              {[...Array(seasons)].map((_, idx) => {
                const v = ++idx;
                return (
                  <option key={v} value={v}>
                    Season {v}
                  </option>
                );
              })}
            </select>
          </Form>
        )}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={data.season_number}
          initial={{ y: 50, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}>
          {data.episodes &&
            data.episodes.map((episode) => {
              return (
                <li className={styles.episode} key={episode.id}>
                  <div className={styles.episode__info}>
                    <div className={styles["episode__info--img"]}>
                      <img
                        src={api.getStillURL(episode.still_path)}
                        alt={episode.name}
                      />
                    </div>
                    <div>
                      <h3>
                        {episode.episode_number}. {episode.name}
                      </h3>
                      <span>{episode.runtime}min</span>
                    </div>
                  </div>
                  <p>{episode.overview}</p>
                </li>
              );
            })}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
};

export default EpisodeSelector;
