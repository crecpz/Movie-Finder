import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = ({ watchlist }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    let resizeTimer;
    //* 使用者 resize 時，關閉 nav 的 transition
    function handleResize() {
      // 關閉 nav
      if (navIsOpen) setNavIsOpen(false);
      // 取消 transtion
      const body = document.body;
      body.classList.add("no-transition");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        body.classList.remove("no-transition");
      }, 100);
    }

    //* 控制 header 顏色，當 scrollY === 0 加上 header 的底色
    function handleScroll() {
      let currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        headerRef.current.classList.remove("header--black");
      } else {
        headerRef.current.classList.add("header--black");
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    //* 當 nav 打開時禁止頁面滾動，並調整 header padding-right
    const body = document.body;
    // 取得 scrollBar 的寬度
    const scrollBarWidth = window.innerWidth - body.clientWidth;
    // 取得 header 目前的 padding-right 值
    const headerPaddingRight = window
      .getComputedStyle(headerRef.current, null)
      .getPropertyValue("padding-right");

    if (navIsOpen) {
      // 如果 nav 目前是開啟狀態
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
        className={`header__menu-btn hamburger ${navIsOpen ? "active" : ""}`}
        onClick={() => setNavIsOpen((prev) => !prev)}>
        <div className="hamburger__line"></div>
        <div className="hamburger__line"></div>
        <div className="hamburger__line"></div>
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
          {watchlist.filter(({ unread }) => unread).length ? (
            <span className="nav__link-number">
              {watchlist.filter(({ unread }) => unread).length}
            </span>
          ) : (
            ""
          )}
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
