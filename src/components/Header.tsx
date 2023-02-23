import { Search } from "iconoir-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "../hooks/useMediaQuery";
import { movieGenreEntries, tvGenreEntries } from "../lib/constants";
import styles from "../styles/header.module.scss";
import { navLinks } from "./MobileNav";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const isLandingPage = useLocation().pathname === "/";
  const isSearchPage = useLocation().pathname === "/search";
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
            <button
              className={styles["sign-in-btn"]}
              onClick={() => navigate("/browse")}>
              Sign In
            </button>
          </>
        )}
        {!isLandingPage && (
          <button
            className={styles["search-btn"]}
            aria-label="Search"
            onClick={() => {
              if (isSearchPage) {
                navigate(-1);
              } else {
                navigate("/search");
              }
            }}>
            {isSearchPage ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
                />
              </svg>
            ) : (
              <Search />
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
