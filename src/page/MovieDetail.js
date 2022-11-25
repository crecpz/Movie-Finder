import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import PulseLoader from "react-spinners/PulseLoader";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData, noBackdrop } from "../utils/function";
import { spinnerStyle } from "../utils/components-styles";
import ScrollToTop from "react-scroll-to-top";

const MovieDetail = ({ watchlist, setWatchlist }) => {
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
  // 表示當前頁面的電影是否已經加進 watchlist
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

  const SIMILAR_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}/similar?api_key=e86818f56e7d92f357708ecb03052800&page=1`;
  const CURRENT_DETAIL_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}?api_key=e86818f56e7d92f357708ecb03052800`;
  const VIDEO_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}/videos?api_key=e86818f56e7d92f357708ecb03052800`;
  const CREDITS_URL = `https://api.themoviedb.org/3/movie/${currentMovieId}/credits?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      getData(CURRENT_DETAIL_URL, setCurrentMovie);
      getData(VIDEO_URL, setVideo);
      getData(SIMILAR_URL, setSimilarMovies);
      getData(CREDITS_URL, setCredits);
    }
    return () => {
      subscribed = false;
    };
  }, []);
  useEffect(() => {
    // 換頁後，恢復 poster & backdrop 的狀態
    setImgIsLoaded(false);
    setImgLoadStatus([
      { type: "backdrop", isLoaded: false },
      { type: "poster", isLoaded: false },
    ]);

    let subscribed = true;
    if (subscribed) {
      getData(CURRENT_DETAIL_URL, setCurrentMovie);
      getData(SIMILAR_URL, setSimilarMovies);
      getData(VIDEO_URL, setVideo);
    }
    // 更新目前的 watchlist 按鈕狀態
    // (如果在 watchlist 中 find() 的結果不是 undefined 就設為 true，否則設為 false)
    setInWatchlist(
      watchlist.find((movie) => movie.id === currentMovieId) !== undefined
    );
    // 換頁後滾動到頂部
    window.scrollTo(0, 0);
    // cleanup func
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

  // console.log(credits.cast.slice(0))
  console.log(
    "sort",
    credits.cast && credits.cast.sort((a, b) => b.popularity - a.popularity)
  );
  console.log("no-sort", credits.cast && credits.cast.slice(0, 15));

  // let creditsSortByPopularity = credits.cast &&

  // * 演員列表
  const creditsElement =
    credits.cast &&
    // credits.cast.slice(0, 15).map(({ character, name, profile_path }) => {
    credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 30)
      .map(({ character, name, profile_path }) => {
        return (
          <div className="movie-detail__cast-card card">
            <img
              className="movie-detail__cast-img"
              src={`https://image.tmdb.org/t/p/w500/${profile_path}`}
              alt="profilie_path"
            />
            <p className="movie-detail__cast-info">
              <span>{name}</span>
              <span>{character}</span>
            </p>
          </div>
        );
      });
  // console.log(credits.cast && credits.cast.slice(0, 5));

  // *  video key
  // 修先取得 Trailer 或 Teaser
  const videoKey =
    video.results &&
    video.results.find(({ type }) => type === "Trailer" || type === "Teaser")
      ? video.results.find(
          ({ type }) => type === "Trailer" || type === "Teaser"
        ).key
      : "";

  // * 相似電影
  const similarMovieElements = similarMovies.results
    ? similarMovies.results.map((movie) => {
        return movie.backdrop_path ? (
          <SwiperSlide key={movie.id}>
            <div className="movie-slide">
              <Link to={`/movie/${movie.id}`} className="movie-slide__img-link">
                <img
                  src={`https://image.tmdb.org/t/p/original/${
                    movie && movie.backdrop_path
                  }`}
                  className="movie-slide__backdrop"
                  alt="movie-backdrop"
                />
              </Link>
              <Link
                to={`/movie/${movie && movie.id}`}
                className="movie-slide__title-link">
                <h2 className="movie-slide__name">
                  {movie && movie.original_title}
                </h2>
              </Link>
            </div>
          </SwiperSlide>
        ) : (
          ""
        );
      })
    : "";

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

  return (
    <>
      <div className={`spinner-full-screen ${!imgIsLoaded && "active"}`}>
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
          <div className="movie-detail__content">
            {/* container--no-limit */}
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

              <div className="movie-detail__texts">
                <h3 className="movie-detail__title">
                  {currentMovie.original_title
                    ? currentMovie.original_title
                    : ""}
                </h3>
                <div className="movie-detail__genres-tag-wrapper genres-tag-wrapper">
                  {currentMovie.genres
                    ? currentMovie.genres.map((genres) => {
                        return (
                          <Link
                            key={genres.id}
                            to={`/movies/genres/${genres.id}`}
                            className="movie-detail__genres-tag genres-tag">
                            {genres.name}
                          </Link>
                        );
                      })
                    : ""}
                </div>
                <div className="info movie-detail__info">
                  <p className="movie-detail__release-date">
                    {currentMovie.release_date || ""}
                  </p>
                  <p className="vote movie-detail__vote">
                    {currentMovie.vote_average || ""}
                    <i className="fa-solid fa-star"></i>
                  </p>
                  <p className="movie-detail__runtime">
                    {currentMovie.runtime || ""} Minutes
                  </p>
                </div>
                <p className="movie-detail__overview">
                  {currentMovie.overview || ""}
                </p>
                <div className="movie-detail__btns">
                  <button className="movie-detail__btn btn btn--red btn--lg">
                    <i className="fa-solid fa-play"></i>Watch Video
                  </button>
                  <button
                    className="movie-detail__btn btn btn--transparent btn--lg"
                    onClick={() => changeWatchlist(currentMovieId)}>
                    <i
                      className={`fa-solid ${
                        inWatchlist ? "fa-check" : "fa-plus"
                      }`}></i>
                    {inWatchlist ? "In Watchlist" : "Add Watchlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* credits */}
        <section className="movie-detail__cast">
          <div className="container">
            <h2 className="layout-title">Cast</h2>
            <div className="movie-detail__cast-cards cards">
              {creditsElement}
            </div>
          </div>
        </section>

        {/* video */}
        <section className="movie-detail__video">
          <div className="container">
            <h2 className="layout-title">Video</h2>
            <div
              className={`movie-detail__iframe-container ${
                videoKey ? "" : "movie-detail__video-container--no-video"
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
                <p className="placeholder-text">No Video!</p>
              )}
            </div>
          </div>
        </section>

        {/* similar moives */}
        <section className="movie-detail__similar movie-swiper">
          <div className="container">
            <h2 className="layout-title">Similar Movies</h2>
            {similarMovies.results && similarMovies.results.length === 0 ? (
              <p className="placeholder-text">No similar movies!</p>
            ) : (
              <Swiper
                effect="coverflow"
                slidesPerView={5}
                spaceBetween={20}
                slidesPerGroup={5}
                loop={true}
                loopFillGroupWithBlank={false}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 0,
                  },
                  576: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 20,
                  },
                  1300: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 20,
                  },
                  1400: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 20,
                  },
                }}>
                {similarMovieElements}
              </Swiper>
            )}
          </div>
        </section>
      </div>
      <ScrollToTop
        smooth
        className="scroll-to-top"
        color="#fff"
        viewBox="0 0 448 512"
        svgPath="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"
      />
    </>
  );
};

export default MovieDetail;
