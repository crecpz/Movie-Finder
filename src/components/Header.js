import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// 上映 in theaters / 下檔 out of theaters

const Header = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const headerRef = useRef();
  const navRef = useRef(null);

  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = (e) => {
      let currentScrollY = window.scrollY;
      if(currentScrollY > lastScrollY){
        console.log('現在在往下滑')
        headerRef.current.classList.add('header--hide');
      }
      
      if(currentScrollY < lastScrollY){
        headerRef.current.classList.remove('header--hide');
        console.log('現在在往上滑')
      }

      lastScrollY = currentScrollY;
      console.log(currentScrollY, lastScrollY)
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [navRef]);

  return (
    <header ref={headerRef} className="header">
      <Link to="/" className="header__logo">
        <h1>
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
        <NavLink to="/movies/genres" className="nav__link">
          Genres
        </NavLink>
        <NavLink to="/watchlist" className="nav__link">
          Watchlist
        </NavLink>
        {/* <NavLink to="/watchlist/unwatched" className="nav__link">
          Watchlist
        </NavLink> */}
        <Link to="/search" className="nav__link">
          <i className="fa-solid fa-magnifying-glass"></i>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
