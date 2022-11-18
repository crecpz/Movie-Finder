import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const headerRef = useRef();
  const navRef = useRef(null);

  // * 向下 scroll 隱藏 scrollbar, 向上 scroll 顯示 scrollbar
  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      if (!navIsOpen) {
        let currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
          headerRef.current.classList.add("header--hide");
        }
        if (currentScrollY < lastScrollY) {
          headerRef.current.classList.remove("header--hide");
        }
        lastScrollY = currentScrollY;
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navIsOpen]);

  useEffect(() => {
    window.addEventListener("resize", handelResize);
    function handelResize() {
      navRef.current.style.transition = "none";
    }

    return () => {
      window.removeEventListener("resize", handelResize);
      navRef.current.style.transition = "";
    };
  }, [navRef]);

  // useEffect(() => {
  //   function handleClickOutside(e) {
  //     if (
  //       navRef.current &&
  //       !navRef.current.contains(e.target) &&
  //       !e.target.classList.contains("header__menu-btn")
  //     ) {
  //       setNavIsOpen(false);
  //     }
  //   }
  //   window.addEventListener("click", handleClickOutside);
  //   return () => window.removeEventListener("click", handleClickOutside);
  // }, [navRef]);

  return (
    <header ref={headerRef} className="header">
      <Link to="/" className="header__logo">
        <h1>
          <i className="fa-solid fa-clapperboard"></i>Movie Finder
        </h1>
      </Link>
      <button
        className={`header__menu-btn ${
          navIsOpen ? "header__menu-btn--nav-open" : ""
        }`}
        onClick={() => setNavIsOpen((prev) => !prev)}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <nav ref={navRef} className={`nav ${navIsOpen ? "nav--open" : ""}`}>
        <NavLink to="/" end className="nav__link">
          Home
        </NavLink>
        <NavLink to="/movies/new" className="nav__link">
          New
        </NavLink>
        <NavLink to="/movies/popular" className="nav__link">
          Popular
        </NavLink>
        <NavLink to="/movies/genres" className="nav__link">
          Genres
        </NavLink>
        <NavLink to="/watchlist" className="nav__link">
          Watchlist
        </NavLink>
        <NavLink to="/search" className="nav__link">
          <i className="fa-solid fa-magnifying-glass"></i>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
