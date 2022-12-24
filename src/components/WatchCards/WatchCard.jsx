import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { noPoster } from "../../utils/function";

const WatchCard = ({ id, poster_path, title, watchlist, setWatchlist }) => {
  // 確認目前位於 Unwatched 還是 Watched
  const { watchStatusTag = "unwatched" } = useParams();
  // watchcards 選項的開啟狀態
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  // watchcards optionBtnRef
  const optionBtnRef = useRef();

  useEffect(() => {
    //* 一旦 watchlist 改變，將新的資料存進 localStorage
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    //* 點擊任何處關閉 watchcard option
    const handleWindowClick = (e) => {
      if (e.target !== optionBtnRef.current) {
        setOptionIsOpen(false);
      }
    };
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  //* 切換觀看狀態 (Unwatched <---> Watched)
  function changeStatus(id) {
    setWatchlist((prev) => {
      return prev.map((movie) => {
        if (movie.id === id) {
          return {
            ...movie,
            status: movie.status === "unwatched" ? "watched" : "unwatched",
          };
        } else {
          return movie;
        }
      });
    });
  }

  //* 處理 watchcard option 點擊後行為
  function handleOptionBtnClick() {
    // 切換 watchcard option 開啟狀態
    setOptionIsOpen((prev) => !prev);
  }

  //* 刪除 watchcard
  function removeWatchcard(id) {
    setWatchlist((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="watchcard card">
      {/* 選單按鈕 */}
      <button
        ref={optionBtnRef}
        className={`watchcard__option-btn hamburger ${
          optionIsOpen ? "active" : ""
        }`}
        onClick={(e) => handleOptionBtnClick(e)}>
        <div className="hamburger__line"></div>
        <div className="hamburger__line"></div>
        <div className="hamburger__line"></div>
      </button>
      {/* 圖片 */}
      <div className="watchcard__img">
        <img
          className="watchcard__movie-poster"
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          onError={noPoster}
          alt="watchcard-poster"
        />
      </div>
      {/* 內容區 */}
      <div className="watchcard__content">
        {title ? <h3 className="watchcard__title">{title}</h3> : ""}
        {/* 三個按鈕 */}
        <div className="watchcard__btns">
          {/* 觀看狀態切換 */}
          <button
            className="btn btn-transparent watchcard__btn"
            onClick={() => changeStatus(id)}>
            {watchStatusTag === "unwatched" ? (
              <i className="fa-regular fa-eye"></i>
            ) : (
              <i className="fa-solid fa-eye-slash"></i>
            )}
            {`${watchStatusTag === "unwatched" ? "Watched" : "Unwatched"}`}
          </button>
          {/* 更多資訊 */}
          <Link
            to={`/movie/${id}`}
            className="btn btn-transparent watchcard__btn">
            <i className="fa-solid fa-info"></i>
            More
          </Link>
          {/* 自 watchlist 移除 */}
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
