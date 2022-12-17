import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  changeWatchlist,
  convertTime,
  getData,
  noAvatar,
  noBackdrop,
  removeDuplicate,
  removeBracketsStr,
  scrollDownTo,
} from "../../utils/function";
import { spinnerStyle } from "../../utils/components-styles";
import ScrollToTop from "react-scroll-to-top";
import MovieSwiper from "../../components/MovieSwiper/MovieSwiper";

import { AnimationOnScroll } from "react-animation-on-scroll";
import "animate.css/animate.min.css";

const MovieDetail = ({ watchlist, setWatchlist, setUnreadList }) => {
  const navigate = useNavigate();
  // 從 useParams() 中拆出 currentMovieId，並將其轉為 Number
  let { id: currentMovieId } = useParams();
  currentMovieId = Number(currentMovieId);
  // 儲存當前電影資料
  const [currentMovie, setCurrentMovie] = useState({});
  // 存放與當前電影相似的其他電影
  const [similarMovies, setSimilarMovies] = useState({});
  // 存放演員資料
  const [credits, setCredits] = useState([]);
  // 存放 video 資料
  const [video, setVideo] = useState({});
  // 存放當前電影是否為加進 watchlist 狀態
  const [inWatchlist, setInWatchlist] = useState(
    watchlist.find((movie) => movie.id === currentMovieId) !== undefined
  );
  // 目前的電影的 poster 與 backdrop 是否都已經載入完畢
  const [imgIsLoaded, setImgIsLoaded] = useState(false);
  // 存放目前電影 poster 與 backdrop 載入狀態
  const [imgLoadStatus, setImgLoadStatus] = useState([
    { type: "backdrop", isLoaded: false },
    { type: "poster", isLoaded: false },
  ]);
  // 指向 video 區塊的 ref
  const videoRef = useRef();
  // API URLs
  const SIMILAR_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}/similar?api_key=e86818f56e7d92f357708ecb03052800&page=1`;
  const CURRENT_DETAIL_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}?api_key=e86818f56e7d92f357708ecb03052800`;
  const VIDEO_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}/videos?api_key=e86818f56e7d92f357708ecb03052800`;
  const CREDITS_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}/credits?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    // 換頁後，恢復 poster & backdrop 的狀態
    setImgIsLoaded(false);
    setImgLoadStatus([
      { type: "backdrop", isLoaded: false },
      { type: "poster", isLoaded: false },
    ]);
    // 取得 API 資料
    let subscribed = true;
    if (subscribed) {
      getData(CURRENT_DETAIL_URL, setCurrentMovie, handleError); // 當前電影資料
      getData(CREDITS_URL, setCredits); // 演員資料
      getData(VIDEO_URL, setVideo); // Video
      getData(SIMILAR_URL, setSimilarMovies); // 相似電影推薦
    }
    // 更新目前的 watchlist 按鈕狀態(樣式)
    // (如果在 watchlist 中 find() 的結果為 undefined 就設為 false，否則設為 true)
    setInWatchlist(
      watchlist.find((movie) => movie.id === currentMovieId) !== undefined
    );
    // 換頁後滾動到頂部
    window.scrollTo(0, 0);
    // cleanup function
    return () => {
      subscribed = false;
    };
  }, [currentMovieId]);

  useEffect(() => {
    // 更新目前的 inWatchlist 狀態
    setInWatchlist(
      watchlist.find((movie) => movie.id === currentMovieId) !== undefined
    );
    // 存至 localStorage
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    // 當 imgLoadStatus 內所有的元素的 isLoaded 屬性皆為 true 時
    // 代表 poster 與 backdrop 都已載入完畢
    if (imgLoadStatus.every(({ isLoaded }) => isLoaded)) {
      // 將 imgIsLoaded state 設為 true(所以 spinner 就會消失)
      setImgIsLoaded(true);
    }
  }, [imgLoadStatus]);

  useEffect(() => {
    // 檢查當前電影的 poster_path 是否為 null
    // 如果為 null，則表示 API 未提供該張圖片
    if (currentMovie.poster_path === null) {
      // 設定 poster 的載入狀態為 true
      // (至於 poster 海報則是直接不顯示)
      setImgLoadStatus((prev) => {
        return prev.map((i) => {
          if (i.type === "poster") {
            return { ...i, isLoaded: true };
          } else {
            return i;
          }
        });
      });
    }
  }, [currentMovie]);

  //*  video key
  // 優先取得 Trailer 或 Teaser
  const videoKey =
    video.results &&
    video.results.find(({ type }) => type === "Trailer" || type === "Teaser")
      ? video.results.find(
          ({ type }) => type === "Trailer" || type === "Teaser"
        ).key
      : "";

  //* 演員列表
  const creditsElement =
    credits.cast &&
    credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 12)
      .map(({ character, name, profile_path }) => {
        return (
          <div className="movie-detail__cast-card">
            <img
              className="movie-detail__cast-img"
              src={`https://image.tmdb.org/t/p/w500/${profile_path}`}
              onError={(e) => noAvatar(e)}
              alt="profilie_path"
            />
            <p className="movie-detail__cast-text">
              <span>{name}</span>
              <span>{removeBracketsStr(character)}</span>
            </p>
          </div>
        );
      });

  /**
   * * 改變目前 poster & backdrop 的載入狀態，並更新至 imgLoadStatus state
   * @param {*} e
   */
  function changeImgStatus(e) {
    const { alt } = e.target;
    setImgLoadStatus((prev) => {
      return prev.map((i) => {
        if (i.type === alt) {
          return { ...i, isLoaded: true };
        } else {
          return i;
        }
      });
    });
  }

  //* 前往一個不存在的網址時，導向 notfound 頁面
  function handleError() {
    navigate("/notfound", { replace: true });
  }

  return (
    <>
    {/* full screen spinner */}
      <div className={`spinner-full-screen${!imgIsLoaded ? " active" : ""}`}>
        <PulseLoader color="#fff" cssOverride={spinnerStyle} />
      </div>

      <div className="movie-detail">
        {/* intro */}
        <section className="movie-detail__intro">
          <div className="movie-detail__backdrop">
            <img
              src={`https://image.tmdb.org/t/p/original/${currentMovie.backdrop_path}`}
              onError={noBackdrop}
              onLoad={(e) => changeImgStatus(e)}
              alt="backdrop"
            />
          </div>
          <div className="container">
            {currentMovie.poster_path !== null && (
              <img
                className="movie-detail__poster"
                src={`https://image.tmdb.org/t/p/original/${
                  currentMovie ? currentMovie.poster_path : ""
                }`}
                onLoad={(e) => changeImgStatus(e)}
                alt="poster"
              />
            )}
            {/* intro 文字部分 */}
            <div className={`movie-detail__texts ${imgIsLoaded ? "show" : ""}`}>
              {/* 電影標題 */}
              <h3 className="movie-detail__title">
                {currentMovie.title ? currentMovie.title : ""}
              </h3>
              {/* 類別標籤 */}
              {currentMovie.genres ? (
                <div className="movie-detail__genres-tags genres-tags">
                  {removeDuplicate(currentMovie.genres, "id").map((genres) => {
                    return (
                      <Link
                        key={genres.id}
                        to={`/movies/genres/${genres.id}`}
                        className="movie-detail__genres-tag genres-tag">
                        {genres.name}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
              {/* 電影資訊 */}
              <div className="movie-detail__info info">
                {/* 上映日期 */}
                {currentMovie.release_date ? (
                  <p className="movie-detail__release-date">
                    <i className="fa-regular fa-calendar"></i>
                    {currentMovie.release_date}
                  </p>
                ) : (
                  ""
                )}
                {/* 評分 */}
                {currentMovie.vote_average ? (
                  <p className="movie-detail__vote vote">
                    <i className="fa-solid fa-star"></i>
                    {currentMovie.vote_average}
                  </p>
                ) : (
                  ""
                )}
                {/* 時長 */}
                {currentMovie.runtime ? (
                  <p className="movie-detail__runtime">
                    <i className="fa-regular fa-clock"></i>
                    {convertTime(currentMovie.runtime)}
                  </p>
                ) : (
                  ""
                )}
              </div>
              {/* 文字介紹 */}
              {currentMovie.overview ? (
                <p className="movie-detail__overview overview">
                  {currentMovie.overview}
                </p>
              ) : (
                ""
              )}
              {/* 按鈕區域 */}
              <div className="movie-detail__btns">
                {/* Watch Video */}
                <button
                  className="movie-detail__btn btn btn--red btn--lg"
                  onClick={() => scrollDownTo(videoRef)}>
                  <i className="fa-solid fa-play"></i>Watch Video
                </button>
                {/* Add Watchlist */}
                <button
                  className="movie-detail__btn btn btn--transparent btn--lg"
                  onClick={() => {
                    changeWatchlist(
                      currentMovieId,
                      inWatchlist,
                      setWatchlist,
                      setUnreadList
                    );
                  }}>
                  <i
                    className={`fa-solid ${
                      inWatchlist ? "fa-check" : "fa-plus"
                    }`}></i>
                  {inWatchlist ? "In Watchlist" : "Add Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* credits(cast) */}
        <section className="movie-detail__cast">
          <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
            <div className="container">
              <h2 className="layout-title">Cast</h2>
              <div
                className={`movie-detail__cast-content movie-detail__layout-content ${
                  credits.cast && credits.cast.length ? "" : "no-cast"
                }`}>
                <input
                  type="checkbox"
                  className={`expand-btn movie-detail__cast-btn ${
                    credits.cast && credits.cast.length > 5
                      ? "movie-detail__cast-btn--show"
                      : ""
                  }`}
                />
                <div
                  className={`movie-detail__cast-cards ${
                    credits.cast && credits.cast.length > 5
                      ? "movie-detail__cast-cards--has-overlay"
                      : ""
                  }`}>
                  {credits.cast && credits.cast.length ? (
                    creditsElement
                  ) : (
                    <p className="empty-msg">No cast information!</p>
                  )}
                </div>
              </div>
            </div>
          </AnimationOnScroll>
        </section>

        {/* video */}
        <section className="movie-detail__video" ref={videoRef}>
          <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
            <div className="container">
              <h2 className="layout-title">Video</h2>
              <div
                className={`movie-detail__iframe-content movie-detail__layout-content ${
                  videoKey ? "" : "movie-detail__iframe-content--no-video"
                }`}>
                {videoKey ? (
                  <iframe
                    className="movie-detail__iframe"
                    src={`https://www.youtube.com/embed/${videoKey}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
                ) : (
                  <p className="empty-msg">No video!</p>
                )}
              </div>
            </div>
          </AnimationOnScroll>
        </section>

        {/* similar moives */}
        <section className="movie-detail__similar">
          <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
            <div className="container">
              <h2 className="layout-title">Similar Movies</h2>
              <div className="movie-detail__similar-content movie-detail__layout-content">
                {similarMovies.results && similarMovies.results.length === 0 ? (
                  <p className="empty-msg">No similar movies!</p>
                ) : (
                  <MovieSwiper
                    movies={similarMovies}
                    swiperBreakpoints={{
                      0: {
                        slidesPerView: 2.5,
                        slidesPerGroup: 2,
                        loop: false,
                      },
                      576: {
                        slidesPerView: 3.5,
                        loop: false,
                      },
                      768: {
                        slidesPerView: 3,
                      },

                      1024: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                      },
                      1300: {
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </AnimationOnScroll>
        </section>

        {/* Related Links */}
        <section className="movie-detail__related-links">
          <AnimationOnScroll animateIn="animate__fadeInUp" animateOnce={true}>
            <div className="container">
              <h2 className="layout-title">Related Links</h2>
              <div className="movie-detail__related-links-content movie-detail__layout-content">
                {currentMovie.homepage ? (
                  <a
                    href={currentMovie.homepage}
                    className="movie-detail__related-link"
                    target="_blank"
                    rel="noreferrer">
                    <i className="fa-solid fa-house"></i>
                    Homepage<i className="fa-solid fa-link"></i>
                  </a>
                ) : (
                  <p className="empty-msg">No related links!</p>
                )}
              </div>
            </div>
          </AnimationOnScroll>
        </section>
      </div>

      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#000"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </>
  );
};

export default MovieDetail;
