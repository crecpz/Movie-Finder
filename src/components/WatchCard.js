import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getData } from "../utils/function";

const WatchCard = ({ watchStatus, id, watched, watchlist, setWatchlist }) => {
  const [currentMovie, setCurrentMovie] = useState({});
  const API_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    getData(API_URL, setCurrentMovie);
  }, [watchStatus]);

  useEffect(() => {
    getData(API_URL, setCurrentMovie);
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

  return (
    <div className="watchcard">
      <img
        className="watchcard__movie-backdrop"
        src={`https://image.tmdb.org/t/p/original/${
          currentMovie ? currentMovie.backdrop_path : ""
        }`}
        alt="watchcard-backdrop"
      />
      {/* <img className="watchcard__movie-backdrop" src={`https://image.tmdb.org/t/p/original/${currentMovie.poster_path}`} alt="" /> */}
      <div className="watchcard__content">
        <h3 className="watchcard__title">
          {currentMovie ? currentMovie.title : ""}
          <br />
        </h3>
        <button
          className="btn btn-transparent watchcard__btn"
          onClick={() => changeStatus(id)}>
          {`Mark as ${watched ? "unwatched" : "watched"}`}
        </button>
        <button
          className="btn btn-transparent watchcard__btn"
          onClick={() => removeWatchcard(id)}>
          Remove
        </button>
        {/* <button className="btn btn-transparent watchcard__btn">
          More Details
        </button> */}
        <Link
          to={`/movie/${currentMovie.id}`}
          className="btn btn-transparent watchcard__btn">
          More Details
        </Link>
      </div>
    </div>
  );
};

export default WatchCard;
