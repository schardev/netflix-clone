import { Search } from "iconoir-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "../hooks/useMediaQuery";
import { movieGenreEntries, tvGenreEntries } from "../pages/GenresModal";
import styles from "../styles/header.module.scss";

const navLinks = [
  { text: "Home", to: "/" },
  { text: "TV Shows", to: "/tv" },
  { text: "Movies", to: "/movie" },
  { text: "My List", to: "/list" },
];

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const isLandingPage = useLocation().pathname.slice(1) === "login";
  const navigate = useNavigate();
  const matches = useMediaQuery("tablet-up");
  const popRef = useRef<HTMLDivElement>(null);

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
        {matches && !isLandingPage && (
          <ul className={styles["nav-left__list"]}>
            {navLinks.map((link) => (
              <li key={link.text}>
                <NavLink to={link.to}>{link.text}</NavLink>
              </li>
            ))}
            <li>
              <div
                className={styles.genre}
                onMouseOver={() => {
                  if (popRef.current) {
                    popRef.current.style.display = "block";
                  }
                }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (popRef.current && !popRef.current.matches(":hover")) {
                      popRef.current.style.display = "none";
                    }
                  }, 300);
                }}>
                <span>Browse By Genres</span>
                <div className={styles["genre-popup"]} ref={popRef}>
                  {[movieGenreEntries, tvGenreEntries].map((genre) => (
                    <div key={genre.title}>
                      <span>{genre.title}</span>
                      <ul>
                        {genre.list.map((link) => (
                          <li key={link.text}>
                            <Link to={link.link}>{link.text}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
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
