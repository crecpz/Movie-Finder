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
  // 獲取當前電影的更多細節(例如電影的 runtime、genres)
  const DETAIL_URL = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=e86818f56e7d92f357708ecb03052800`;
  // 存放獲取到的當前電影細節資料
  const [currentMovie, setCurrentMovie] = useState({});
  // 當前電影圖片載入狀態(載入後才顯示卡片上的文字與按鈕)
  const [imgOnload, setImgOnload] = useState(false);

  useEffect(() => {
    let subscribed = true;
    // 獲取此電影的更多細節，並存至 currentMovie
    if (subscribed) getData(DETAIL_URL, setCurrentMovie);
    return () => {
      subscribed = false;
    };
  }, []);

  return (
    <li className="search-result">
      {/* 圖片區域(帶有連結) */}
      <Link to={`/movie/${movie.id}`} className="search-result__img-link">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          className="search-result__poster"
          onError={noPoster}
          onLoad={() => setImgOnload(true)}
          alt="search-result-img"
        />
      </Link>
      {/* 文字區域 */}
      <div className={`search-result__texts ${imgOnload ? "" : "hide"}`}>
        {/* 標題(帶有連結) */}
        <Link to={`/movie/${movie.id}`} className="search-result__title">
          {movie.original_title ? <h3>{movie.original_title}</h3> : ""}
        </Link>
        {/* 電影資訊 */}
        <div className="search-result__info info">
          {/* 上映日期 */}
          {movie.release_date ? (
            <p className="search-result__release-date release-date">
              <i className="fa-regular fa-calendar"></i>
              {movie.release_date}
            </p>
          ) : (
            ""
          )}
          {/* 評分 */}
          {movie.vote_average ? (
            <p className="search-result__vote vote">
              <i className="fa-solid fa-star"></i>
              {movie.vote_average}
            </p>
          ) : (
            ""
          )}
          {/* 時長 */}
          {currentMovie && currentMovie.runtime ? (
            <p className="search-result__runtime">
              <i className="fa-regular fa-clock"></i>
              {convertTime(currentMovie.runtime)}
            </p>
          ) : (
            ""
          )}
        </div>
        {/* 類別標籤 */}
        {currentMovie && currentMovie.genres && currentMovie.genres.length ? (
          <div className="search-result__genres-tags genres-tags">
            {removeDuplicate(currentMovie.genres, "id").map((genres) => {
              return (
                <Link
                  key={genres.id}
                  to={`/movies/genres/${genres.id}`}
                  className="search-result__genres-tag genres-tag">
                  {genres.name}
                </Link>
              );
            })}
          </div>
        ) : (
          ""
        )}
        {/* add watlist 按鈕 */}
        <button
          className={`search-result__btn btn btn--sm btn--transparent ${
            inWatchlist ? "active" : ""
          } ${imgOnload ? "" : "hide"}`}
          onClick={() => {
            changeWatchlist(movie.id, inWatchlist, setWatchlist, setUnreadList);
          }}>
          <i className={`fa-solid ${inWatchlist ? "fa-check" : "fa-plus"}`}></i>
          {inWatchlist ? "In Watchlist" : "Add Watchlist"}
        </button>
      </div>
    </li>
  );
};

export default SearchResult;
