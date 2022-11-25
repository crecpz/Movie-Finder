import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // window.addEventListener("scroll", handleScroll);

    // ! 注意!最後要禁用的屬性具體要看 nav 使用了什麼，目前還未定(看下方箭頭)
    // ! 注意!最後要禁用的屬性具體要看 nav 使用了什麼，目前還未定(看下方箭頭)
    // ! 注意!最後要禁用的屬性具體要看 nav 使用了什麼，目前還未定(看下方箭頭)
    // * 使用者 resize 時，關閉 nav 的 transition
    function handleResize() {
      navRef.current.style.transition = "none"; // ! <---
      navRef.current.style.animation = "none"; // ! <---
      setNavIsOpen(false);
      setTimeout(() => {
        navRef.current.style.transition = "";
      }, 100);
    }

    // function handleScroll() {
    //   let currentScrollY = window.scrollY;
    //   if (currentScrollY === 0) {
    //     headerRef.current.classList.remove("header--scrolling");
    //   } else {
    //     headerRef.current.classList.add("header--scrolling");
    //   }
    // }

    return () => {
      window.removeEventListener("resize", handleResize);
      // window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // * 當 nav 打開時禁止頁面滾動，並調整 header padding-right
    const body = document.body;
    const scrollBarWidth = window.innerWidth - body.clientWidth;
    const headerPaddingRight = window
      .getComputedStyle(headerRef.current, null)
      .getPropertyValue("padding-right");

    if (navIsOpen) {
      body.style.overflowY = "hidden";
      headerRef.current.style.paddingRight = `${
        parseInt(headerPaddingRight) + scrollBarWidth
      }px`;
    } else {
      body.style.overflowY = "";
      headerRef.current.style.paddingRight = "";
    }
  }, [navIsOpen]);

  return (
    <header ref={headerRef} className="header">
      <Link to="/" className="header__logo" onClick={() => setNavIsOpen(false)}>
        <h1>
          <i className="fa-solid fa-clapperboard"></i>Movie Finder
        </h1>
      </Link>
      <button
        className={`header__menu-btn ${navIsOpen ? "active" : ""}`}
        onClick={() => setNavIsOpen((prev) => !prev)}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      <nav ref={navRef} className={`nav ${navIsOpen ? "nav--open" : ""}`}>
        <NavLink
          to="/"
          end
          className="nav__link"
          onClick={() => setNavIsOpen(false)}>
          Home
        </NavLink>
        <NavLink
          to="/movies/new"
          className="nav__link"
          onClick={() => setNavIsOpen(false)}>
          New
        </NavLink>
        <NavLink
          to="/movies/popular"
          className="nav__link"
          onClick={() => setNavIsOpen(false)}>
          Popular
        </NavLink>
        <NavLink
          to="/movies/genres"
          className="nav__link"
          onClick={() => setNavIsOpen(false)}>
          Genres
        </NavLink>
        <NavLink
          to="/watchlist"
          className="nav__link"
          onClick={() => setNavIsOpen(false)}>
          Watchlist
        </NavLink>
        <NavLink
          to="/search"
          className="nav__link"
          onClick={() => setNavIsOpen(false)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
