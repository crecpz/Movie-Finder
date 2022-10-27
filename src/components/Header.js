import { Link } from "react-router-dom";
// 上映 in theaters / 下檔 out of theaters

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <i className="fa-solid fa-film"></i>Movie Finder
      </Link>
      <nav className="nav">
        <Link to="/movies/in_theaters" className="nav__link">
          In theaters
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
