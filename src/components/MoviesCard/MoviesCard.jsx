import { useState } from "react";
import { Link } from "react-router-dom";
import { changeWatchlist } from "../../utils/function";

const MoviesCard = ({ movie, inWatchlist, setWatchlist, setUnreadList }) => {
  // 當前電影圖片載入狀態(載入後才顯示卡片上的文字與按鈕)
  const [imgOnload, setImgOnload] = useState(false);

  return (
    <Link to={`/movie/${movie.id}`} className="movies-card-link card">
      <div className="movies-card">
        <img
          className="movies-card__img"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          onLoad={() => setImgOnload(true)}
          alt="movie-card-img"
        />
        {/* add watlist 按鈕 */}
        <button
          className={`movies-card__btn btn ${inWatchlist ? "active" : ""} ${
            imgOnload ? "" : "hide"
          }`}
          onClick={(e) => {
            e.preventDefault();
            changeWatchlist(movie.id, inWatchlist, setWatchlist, setUnreadList);
          }}>
          <i className={`fa-solid ${inWatchlist ? "fa-check" : "fa-plus"}`}></i>
        </button>
        {/* 文字部分 */}
        <div className={`movies-card__text ${imgOnload ? "" : "hide"}`}>
          <h3 className="movies-card__title">{movie.title}</h3>
          <div className="movies-card__info">
            {movie.release_date ? <p>{movie.release_date}</p> : ""}
            {movie.vote_average ? (
              <p>
                <i className="fa-solid fa-star"></i>
                {movie.vote_average}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MoviesCard;
