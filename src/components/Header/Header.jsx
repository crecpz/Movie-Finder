import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = ({ unreadList }) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    // 監聽 scroll 事件
    window.addEventListener("scroll", handleScroll);
    // 監聽 resize 事件
    window.addEventListener("resize", handleResize);
    //* 控制 header 顏色，當 scrollY === 0 加上 header 的底色
    function handleScroll() {
      let currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        headerRef.current.classList.remove("header--black");
      } else {
        headerRef.current.classList.add("header--black");
      }
    }
    //* 在 resize 將 nav 關閉
    function handleResize() {
      if(window.innerWidth > 768) {
        setNavIsOpen((prev) => (prev ? false : prev));
      }
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    //* 當 nav 打開時禁止頁面滾動，並調整 header padding-right
    const body = document.body;
    // 取得 scrollBar 的寬度
    const scrollBarWidth = window.innerWidth - body.clientWidth;
    // 取得 header 目前已經設定的 padding-right 值
    const headerPaddingRight = window
      .getComputedStyle(headerRef.current, null)
      .getPropertyValue("padding-right");
    // 如果 nav 目前是開啟狀態
    if (navIsOpen) {
      body.style.overflowY = "hidden";
      body.style.touchAction = "none";
      headerRef.current.style.paddingRight = `${
        parseInt(headerPaddingRight) + scrollBarWidth
      }px`;
      // 將 nav 加入 inline-style transition
      // useEffect 最下方會利用 setTimeout 在 1000ms 後清除 transition　inline-style
      navRef.current.style.transition = "500ms ease-in-out";
      navRef.current.style.transitionProperty = "opacity, visibility";
    } else {
      body.style.overflowY = "";
      body.style.touchAction = "";
      headerRef.current.style.paddingRight = "";
    }
    // 1000ms 後，清除 navRef 的 transition inline-style
    const timer = setTimeout(() => {
      if (!navIsOpen) {
        navRef.current.style.transition = "";
        navRef.current.style.transitionProperty = "";
      }
    }, 1000);
    // cleanup function
    return () => clearTimeout(timer);
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
          {unreadList.length === 0 ? (
            ""
          ) : (
            <span className="nav__link-number">{unreadList.length}</span>
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
