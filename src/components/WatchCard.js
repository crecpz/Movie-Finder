import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getData } from "../functions/function";

const WatchCard = ({
  // currentMovieId,
  id,
  currentList,
  changeStatus,
  watchlist,
}) => {

  // ! 現在大的問題在於所有跟 fetch 有關的內容在改變 watchlist 狀態後，都不會立即更新
  // ! 也就是說卡片雖然換成正確的了，但 title 與圖片等都沒變!

  const [currentMovie, setCurrentMovie] = useState({});
  const API_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    getData(API_URL, setCurrentMovie);
  }, []);

  // useEffect(() => {
  //   getData(API_URL, setCurrentMovie);
  // }, [watchlist]);



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
          {id}
        </h3>
        <button
          className="btn btn-transparent watchcard__btn"
          onClick={() => changeStatus(id)}>
          {`Mark as ${currentList === "unwatched" ? "watched" : "unwatched"}`}
        </button>
        <button className="btn btn-transparent watchcard__btn">Remove</button>
        <button className="btn btn-transparent watchcard__btn">
          More Details
        </button>
        <Link to={`/movie/${currentMovie && currentMovie.id}`} className="btn">
          More Details
        </Link>
      </div>
    </div>
  );
};

export default WatchCard;
