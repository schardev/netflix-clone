import { Search } from "iconoir-react";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/header.module.scss";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const isLandingPage = useLocation().pathname.slice(1) === "login";
  const navigate = useNavigate();

  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 30) {
        headerRef.current?.classList.add(styles["header-blur"]);
      } else {
        headerRef.current?.classList.remove(styles["header-blur"]);
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <Link to="/" className={styles["nf-logo"]}>
        <img src="/logo.svg" alt="netflix logo" />
      </Link>
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
    </header>
  );
};

export default Header;
