import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";

const Header = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const headerRef = useRef();
  const navRef = useRef(null);

  // * 向下 scroll 隱藏 scrollbar, 向上 scroll 顯示 scrollbar
  useEffect(() => {
    // 記住上一次 scrollY 值 (初始是在頂端，所以預設為 0)
    let lastScrollY = 0;
    const handleScroll = (e) => {
      // 僅在 navIsOpen 為 false 的時候執行
      if (!navIsOpen) {
        // 取得最新的 scrollY
        let currentScrollY = window.scrollY;
        // 如果最新的 scrollY 比上一次的 scrollY 還要大，代表現在正在往下滑
        if (currentScrollY > lastScrollY) {
          // 隱藏 header
          headerRef.current.classList.add("header--hide");
        } else {
          // 否則顯示 header
          headerRef.current.classList.remove("header--hide");
        }
        // 更新上次 scrollY
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
      setTimeout(() => {
        navRef.current.style.transition = "";
      }, 100);
    }
    return () => {
      window.removeEventListener("resize", handelResize);
    };
  }, []);

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
          onClick={() => setNavIsOpen((prev) => !prev)}>
          Home
        </NavLink>
        <NavLink
          to="/movies/new"
          className="nav__link"
          onClick={() => setNavIsOpen((prev) => !prev)}>
          New
        </NavLink>
        <NavLink
          to="/movies/popular"
          className="nav__link"
          onClick={() => setNavIsOpen((prev) => !prev)}>
          Popular
        </NavLink>
        <NavLink
          to="/movies/genres"
          className="nav__link"
          onClick={() => setNavIsOpen((prev) => !prev)}>
          Genres
        </NavLink>
        <NavLink
          to="/watchlist"
          className="nav__link"
          onClick={() => setNavIsOpen((prev) => !prev)}>
          Watchlist
        </NavLink>
        <NavLink
          to="/search"
          className="nav__link"
          onClick={() => setNavIsOpen((prev) => !prev)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
