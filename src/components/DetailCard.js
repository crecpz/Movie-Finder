import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getData, noPoster } from "../utils/function";

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

  // /**
  //  * * 更新 watchlist 資料，
  //  * * 如果已存在於 watchlist，則從 watchlist 中剔除；
  //  * * 否則新增一筆新資料。
  //  * @param {*} id 目前頁面電影的 Id
  //  */
  // function changeWatchlist(id) {
  //   setWatchlist((prev) => {
  //     if (inWatchlist) {
  //       return prev.filter((movie) => movie.id !== id);
  //     } else {
  //       // watched: 是否已觀看
  //       // isLoaded: 是否已經載入，預設 false
  //       return [...prev, { id: id, watched: false }];
  //     }
  //   });
  // }

  /**
   * * 更新 watchlist 資料，
   * * 如果已存在於 watchlist，則從 watchlist 中剔除；
   * * 否則新增一筆新資料。
   * @param {*} id 目前頁面電影的 Id
   */
  function changeWatchlist(id) {
    setWatchlist((prev) => {
      if (inWatchlist) {
        return prev.filter((movie) => movie.id !== id);
      } else {
        // status: 觀看狀態，預設為 unwatched
        return [...prev, { id: id, status: "unwatched" }];
      }
    });
  }

  return (
    <li className="detail-card">
      <Link to={`/movie/${movie && movie.id}`} className="detail-card__link">
        <img
          src={`https://image.tmdb.org/t/p/w300/${movie && movie.poster_path}`}
          className="detail-card__poster"
          onError={noPoster}
          alt="detail-card-img"
        />
      </Link>
      <div className="detail-card__texts">
        <Link to={`/movie/${movie && movie.id}`} className="detail-card__link">
          <h3 className="detail-card__title">
            {movie ? movie.original_title : ""}
          </h3>
        </Link>
        <div className="info detail-card__info">
          {movie && movie.release_date ? (
            <p className="release-date detail-card__release-date">
              {movie.release_date}
            </p>
          ) : (
            ""
          )}
          {movie && movie.vote_average ? (
            <p className="vote detail-card__vote">
              {movie.vote_average} <i className="fa-solid fa-star"></i>
            </p>
          ) : (
            ""
          )}
          {movie && currentMovie.runtime ? (
            <p className="detail-card__runtime">
              {currentMovie.runtime} Minutes
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="detail-card__genres-tag-wrapper genres-tag-wrapper">
          {currentMovie && currentMovie.genres
            ? currentMovie.genres.map((genres) => {
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
          className="detail-card__btn btn btn--transparent btn--sm"
          onClick={() => changeWatchlist(id)}>
          <i className={`fa-solid ${inWatchlist ? "fa-check" : "fa-plus"}`}></i>
          {inWatchlist ? "In Watchlist" : "Add Watchlist"}
        </button>
        {/* <button className="detail-card__btn btn btn--transparent btn--sm">
          <i className="fa-solid fa-plus"></i>Add Watchlist
        </button> */}
      </div>
    </li>
  );
};

export default DetailCard;
