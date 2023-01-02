import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { noPoster } from "../../utils/function";
import { useOutletContext } from "react-router-dom";

const WatchCard = ({ id, poster_path, original_title, setWatchlist }) => {
  // 網址參數(用於確認目前位於 Unwatched 還是 Watched
  const { currentWatchStatus = "unwatched" } = useParams();
  // watchcards 選項的開啟狀態
  const [optionIsOpen, setOptionIsOpen] = useState(false);
  // watchcards optionBtnRef
  const optionBtnRef = useRef();
  // 設定 watchlist__status-btn 的閃爍狀態(來自 Watchlist.jsx 的 <Outlet /> context)
  const [statusBtnFlashing, setStatusBtnFlashing] = useOutletContext();

  //* 點擊任何處關閉 watchcard option
  useEffect(() => {
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

  //* 處理 watchcard option 點擊後行為
  function handleOptionBtnClick() {
    // 切換 watchcard option 開啟狀態
    setOptionIsOpen((prev) => !prev);
  }

  //* 切換觀看狀態
  function changeWatchStatus(e, id) {
    // 將 watchcard 新增動畫
    e.target.closest(".watchcard").classList.add("removing-animation");
    // 將 watchlist__status-btn 新增閃爍動畫
    setStatusBtnFlashing(true);
    // 於指定時間到後，恢復 statusBtnFlashing false
    setTimeout(() => {
      setStatusBtnFlashing(false);
    }, 1200);
    // 於指定時間到後，改變觀看狀態(註：300ms 為 `removing-animation` class 的 animation-duration)
    setTimeout(() => {
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
    }, 300);
  }

  //* 刪除 watchcard
  function removeWatchcard(e, id) {
    // 將 watchcard 新增動畫
    e.target.closest(".watchcard").classList.add("removing-animation");
    // 於指定時間到後，刪除 watchcard 資料(註：300ms 為 `removing-animation` class 的 animation-duration)
    setTimeout(() => {
      setWatchlist((prev) => {
        return prev.filter((i) => i.id !== id);
      });
    }, 300);
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
      {/* 三個按鈕 */}
      <div className="watchcard__btns">
        {/* 按鈕-觀看狀態切換 */}
        <button
          className="btn btn-transparent watchcard__btn"
          onClick={(e) => changeWatchStatus(e, id)}>
          {currentWatchStatus === "unwatched" ? (
            <i className="fa-regular fa-eye"></i>
          ) : (
            <i className="fa-solid fa-eye-slash"></i>
          )}
        </button>
        {/* 按鈕-更多資訊 */}
        <Link
          to={`/movie/${id}`}
          className="btn btn-transparent watchcard__btn">
          <i className="fa-solid fa-info"></i>
        </Link>
        {/* 按鈕-自 watchlist 移除 */}
        <button
          className="btn btn-transparent watchcard__btn"
          onClick={(e) => removeWatchcard(e, id)}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
      {/* 圖片 */}
      <div className="watchcard__img">
        <img
          className="watchcard__movie-poster"
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          onError={noPoster}
          alt="watchcard-poster"
        />
      </div>
      {/* 電影名稱 */}
      <h3 className="watchcard__title">{original_title}</h3>
    </div>
  );
};

export default WatchCard;
