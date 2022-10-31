import { Link } from "react-router-dom";
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
          <i className="fa-solid fa-film"></i>Movie Finder
        </h1>
      </Link>
      <button
        className="header__menu-btn"
        onClick={() => setNavIsOpen((prev) => !prev)}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <nav ref={navRef} className={`nav${navIsOpen ? " nav--open" : ""}`}>
        <Link to="/" className="nav__link">
          Home
        </Link>
        <Link to="/movies/new" className="nav__link">
          New
        </Link>
        <Link to="/movies/popular" className="nav__link">
          Popular
        </Link>
        <Link to="/watchlist" className="nav__link">
          Watchlist
        </Link>
      </nav>
    </header>
  );
};

export default Header;
