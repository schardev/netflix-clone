import { CinemaOld, Emoji, HomeSimple, List, Tv } from "iconoir-react";
import { NavLink } from "react-router-dom";
import { useModalDispatcher } from "../contexts/ModalContext";
import styles from "../styles/mobile-nav.module.scss";

const MobileNav = () => {
  const setModalData = useModalDispatcher();

  return (
    <nav className={styles["mobile-nav"]}>
      <ul>
        <li>
          <button>
            <NavLink to="/" end>
              <HomeSimple />
              <span>Home</span>
            </NavLink>
          </button>
        </li>
        <li>
          <button>
            <NavLink to="tv">
              <Tv />
              <span>TV Shows</span>
            </NavLink>
          </button>
        </li>
        <li>
          <button>
            <NavLink to="movie">
              <CinemaOld />
              <span>Movies</span>
            </NavLink>
          </button>
        </li>
        <li>
          <button>
            <NavLink to="list">
              <List />
              <span>My List</span>
            </NavLink>
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              setModalData({ visible: true, category: "list" });
            }}>
            <Emoji />
            <span>Genres</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNav;
