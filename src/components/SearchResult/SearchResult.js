import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  changeWatchlist,
  convertTime,
  getData,
  noPoster,
  removeDuplicate,
} from "../../utils/function";

const SearchResult = ({ movie, inWatchlist, setWatchlist, setUnreadList }) => {
  const id = movie.id;
  const CURRENT_DETAIL_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;
  const [currentMovie, setCurrentMovie] = useState({});

  useEffect(() => {
    let subscribed = true;
    if (subscribed) getData(CURRENT_DETAIL_URL, setCurrentMovie);
    return () => {
      subscribed = false;
    };
  }, []);

  return (
    <li className="search__result">
      <Link
        to={`/movie/${movie && movie.id}`}
        className="search__result__img-link">
        <img
          src={`https://image.tmdb.org/t/p/w300/${movie && movie.poster_path}`}
          className="search__result__poster"
          onError={noPoster}
          alt="search__result-img"
        />
      </Link>
      <div className="search__result__texts">
        <Link
          to={`/movie/${movie && movie.id}`}
          className="search__result__title">
          {movie.title ? <h3>{movie.title}</h3> : ""}
        </Link>
        {/* 電影資訊 */}
        <div className="search__result__info info">
          {/* 上映日期 */}
          {movie.release_date ? (
            <p className="search__result__release-date release-date">
              <i className="fa-regular fa-calendar"></i>
              {movie.release_date}
            </p>
          ) : (
            ""
          )}
          {/* 評分 */}
          {movie.vote_average ? (
            <p className="search__result__vote vote">
              <i className="fa-solid fa-star"></i>
              {movie.vote_average}
            </p>
          ) : (
            ""
          )}
          {/* 時長 */}
          {currentMovie.runtime ? (
            <p className="search__result__runtime">
              <i className="fa-regular fa-clock"></i>
              {convertTime(currentMovie.runtime)}
            </p>
          ) : (
            ""
          )}
        </div>
        {/* 類別標籤 */}
        <div className="search__result__genres-tags genres-tags">
          {currentMovie && currentMovie.genres
            ? removeDuplicate(currentMovie.genres, "id").map((genres) => {
                return (
                  <Link
                    key={genres.id}
                    to={`/movies/genres/${genres.id}`}
                    className="search__result__genres-tag genres-tag">
                    {genres.name}
                  </Link>
                );
              })
            : ""}
        </div>
        <button
          className="search__result__btn card-btn btn btn--sm btn--transparent"
          onClick={() => {
            changeWatchlist(id, inWatchlist, setWatchlist, setUnreadList);
          }}>
          <i className={`fa-solid ${inWatchlist ? "fa-check" : "fa-plus"}`}></i>
          {inWatchlist ? "In Watchlist" : "Add Watchlist"}
        </button>
      </div>
    </li>
  );
};

export default SearchResult;
