import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  changeWatchlist,
  convertTime,
  getData,
  noPoster,
  removeDuplicate,
} from "../utils/function";

const DetailCard = ({ movie, inWatchlist, setWatchlist }) => {
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
    <li className="detail-card">
      <Link
        to={`/movie/${movie && movie.id}`}
        className="detail-card__img-link">
        <img
          src={`https://image.tmdb.org/t/p/w300/${movie && movie.poster_path}`}
          className="detail-card__poster"
          onError={noPoster}
          alt="detail-card-img"
        />
      </Link>
      <div className="detail-card__texts">
        <Link to={`/movie/${movie && movie.id}`} className="detail-card__title">
          {movie.title ? <h3>{movie.title}</h3> : ""}
        </Link>
        {/* 電影資訊 */}
        <div className="detail-card__info info">
          {/* 上映日期 */}
          {movie.release_date ? (
            <p className="detail-card__release-date release-date">
              <i className="fa-regular fa-calendar"></i>
              {movie.release_date}
            </p>
          ) : (
            ""
          )}
          {/* 評分 */}
          {movie.vote_average ? (
            <p className="detail-card__vote vote">
              <i className="fa-solid fa-star"></i>
              {movie.vote_average}
            </p>
          ) : (
            ""
          )}
          {/* 時長 */}
          {currentMovie.runtime ? (
            <p className="detail-card__runtime">
              <i className="fa-regular fa-clock"></i>
              {convertTime(currentMovie.runtime)}
            </p>
          ) : (
            ""
          )}
        </div>
        {/* 類別標籤 */}
        <div className="detail-card__genres-tags genres-tags">
          {currentMovie && currentMovie.genres
            ? removeDuplicate(currentMovie.genres, "id").map((genres) => {
                return (
                  <Link
                    key={genres.id}
                    to={`/movies/genres/${genres.id}`}
                    className="detail-card__genres-tag genres-tag">
                    {genres.name}
                  </Link>
                );
              })
            : ""}
        </div>
        <button
          className="detail-card__btn card-btn btn btn--sm btn--transparent"
          onClick={() => changeWatchlist(id, inWatchlist, setWatchlist)}>
          <i className={`fa-solid ${inWatchlist ? "fa-check" : "fa-plus"}`}></i>
          {inWatchlist ? "In Watchlist" : "Add Watchlist"}
        </button>
      </div>
    </li>
  );
};

export default DetailCard;
