import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getData } from "../utils/function";

const WatchCard = ({ id, watchStatus, watched, watchlist, setWatchlist }) => {
  // 存放當前電影資料 API_URL
  const [currentMovie, setCurrentMovie] = useState({});
  // 當前電影資料 API_URL
  const API_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    let subscribed = true;

    // 取得當前電影資料
    if (subscribed) getData(API_URL, setCurrentMovie);

    return () => {
      subscribed = false;
    };
  }, [watchStatus, watchlist]);

  useEffect(() => {
    // 一旦 watchlist 改變，將新的資料存進 localStorage
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // * 改變觀看狀態
  function changeStatus() {
    setWatchlist((prevWatchlist) => {
      return prevWatchlist.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            watched: !i.watched,
          };
        } else {
          return i;
        }
      });
    });
  }

  // * 刪除 watchcard
  function removeWatchcard(id) {
    setWatchlist((prevWatchlist) => {
      return prevWatchlist.filter((i) => i.id !== id);
    });
  }

  function changeImgStatus(id) {
    // setImgLoadStatus((prev) => {
    //   prev.map((card) => {
    //     if (card.id === id) {
    //       return {
    //         ...card,
    //         isLoaded: true,
    //       };
    //     } else {
    //       return card;
    //     }
    //   });
    // });
  }

  return Object.keys(currentMovie).length === 0 ? (
    ""
  ) : (
    <div className="watchcard card">
      <div className="watchcard__img">
        <img
          className="watchcard__movie-poster"
          src={`https://image.tmdb.org/t/p/original/${currentMovie.poster_path}`}
          onLoad={() => changeImgStatus(id)}
          // data-id={currentMovie.id}
          alt="watchcard-poster"
        />
      </div>

      <div className="watchcard__content">
        <h3 className="watchcard__title">
          {currentMovie ? currentMovie.title : ""}
          <br />
        </h3>
        <div className="watchcard__btns">
          <button
            className="btn btn-transparent watchcard__btn"
            onClick={() => changeStatus(id)}>
            {watched ? (
              <i className="fa-solid fa-eye-slash"></i>
            ) : (
              <i className="fa-regular fa-eye"></i>
            )}
            {`${watched ? "Unwatched" : "Watched"}`}
          </button>
          <Link
            to={`/movie/${currentMovie.id}`}
            className="btn btn-transparent watchcard__btn">
            <i className="fa-solid fa-info"></i>
            More
          </Link>
          <button
            className="btn btn-transparent watchcard__btn"
            onClick={() => removeWatchcard(id)}>
            <i className="fa-regular fa-trash-can"></i>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchCard;
