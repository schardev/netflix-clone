import { CinemaOld, Emoji, HomeSimple, List, Tv } from "iconoir-react";
import { NavLink } from "react-router-dom";
import { useModalDispatcher } from "../contexts/ModalContext";
import styles from "../styles/mobile-nav.module.scss";

export const navLinks = [
  { text: "Home", to: "/browse", icon: <HomeSimple /> },
  { text: "TV Shows", to: "/tv", icon: <Tv /> },
  { text: "Movies", to: "/movie", icon: <CinemaOld /> },
  { text: "My List", to: "/list", icon: <List /> },
];

const MobileNav = () => {
  const setModalData = useModalDispatcher();

  return (
    <nav className={styles["mobile-nav"]}>
      <ul>
        {navLinks.map((link) => (
          <li key={link.text}>
            <button>
              <NavLink to={link.to}>
                {link.icon}
                <span>{link.text}</span>
              </NavLink>
            </button>
          </li>
        ))}
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
