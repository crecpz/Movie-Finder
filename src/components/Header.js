import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// 上映 in theaters / 下檔 out of theaters

const Header = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        !e.target.classList.contains("header__menu-btn")
      ) {
        setNavIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [navRef]);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <h1>
          {/* <i className="fa-solid fa-film"></i>Movie Finder */}
          <i className="fa-solid fa-clapperboard"></i>Movie Finder
        </h1>
      </Link>
      <button
        className="header__menu-btn"
        onClick={() => setNavIsOpen((prev) => !prev)}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <nav ref={navRef} className={`nav${navIsOpen ? " nav--open" : ""}`}>
        <NavLink to="/" end className="nav__link">
          Home
        </NavLink>
        <NavLink to="/movies/new" className="nav__link">
          New
        </NavLink>
        <NavLink to="/movies/popular" className="nav__link">
          Popular
        </NavLink>
        <NavLink to="/movies/genres/28" className="nav__link">
          Genres
        </NavLink>
        <NavLink to="/watchlist/unwatched" className="nav__link">
          Watchlist
        </NavLink>
        <Link to="/search" className="nav__link">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
