import { useEffect, useState } from "react";
import { getData } from "../utils/function";
import { Link } from "react-router-dom";
import MovieSwiper from "./MovieSwiper";

const HomeGenresSwiper = ({ id, name, show }) => {
  const DISCOVER_GENRES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=e86818f56e7d92f357708ecb03052800&sort_by=popularity.desc&page=1&with_genres=${id}`;
  const [genresContent, setGenresContent] = useState([]);

  useEffect(() => {
    let subscribed = true;
    if (subscribed) getData(DISCOVER_GENRES_URL, setGenresContent);
    return () => {
      subscribed = false;
    };
  }, []);

  return show ? (
    <li className="home__genres-item">
      <Link to={`movies/genres/${id}`} className="home__genres-link">
        <h2 className="layout-title">{name}</h2>
        <i className="fa-solid fa-angle-right"></i>
      </Link>
      <MovieSwiper movies={genresContent} />
    </li>
  ) : (
    ""
  );
};

export default HomeGenresSwiper;
