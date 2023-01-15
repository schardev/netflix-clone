import { Search } from "iconoir-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "../hooks/useMediaQuery";
import styles from "../styles/header.module.scss";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const isLandingPage = useLocation().pathname.slice(1) === "login";
  const navigate = useNavigate();
  const matches = useMediaQuery("tablet-up");

  const scrollHandler = () => {
    if (headerRef.current && window.scrollY > 30) {
      headerRef.current?.classList.add(styles["header-blur"]);
    } else {
      headerRef.current?.classList.remove(styles["header-blur"]);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles["nav-left"]}>
        <Link to="/" className={styles["nf-logo"]}>
          <img src="/logo.svg" alt="netflix logo" />
        </Link>
        {(matches && !isLandingPage) && (
          <ul className={styles["nav-left__list"]}>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/tv">TV Shows</NavLink></li>
            <li><NavLink to="/movie">Movies</NavLink></li>
            <li><NavLink to="/list">My List</NavLink></li>
          </ul>
        )}
      </div>
      <div className={styles["nav-right"]}>
        {isLandingPage && (
          <>
            <div className={styles["lang-selector"]}>
              <select defaultValue="english" name="language">
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
            <button className={styles["sign-in-btn"]}>Sign In</button>
          </>
        )}
        {!isLandingPage && (
          <button
            className={styles["search-btn"]}
            onClick={() => navigate("/search")}>
            <Search />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
