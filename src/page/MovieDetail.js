import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import PulseLoader from "react-spinners/PulseLoader";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData, noBackdrop, noPoster } from "../utils/function";
import { spinnerStyle } from "../utils/components-styles";

const MovieDetail = ({ watchlist, setWatchlist }) => {
  const { id } = useParams();
  // 儲存當前電影資料
  const [currentMovie, setCurrentMovie] = useState({});
  // 存放與當前電影相似的其他電影
  const [similarMovies, setSimilarMovies] = useState({});
  // 儲存預告片資料
  const [trailer, setTrailer] = useState({});
  // 表示當前頁面的電影是否已經加進 watchlist
  const [inWatchlist, setInWatchlist] = useState(
    watchlist.find((movie) => movie.id === id) !== undefined
  );

  // // 目前已經載入
  // const currentMovieObjLoaded =
  //   currentMovie && Object.keys(currentMovie).length !== 0;

  // 目前的電影的 poster 與 backdrop 是否都已經載入完畢
  const [imgIsLoaded, setImgIsLoaded] = useState(false);
  // 存放目前電影 poster 與 backdrop 載入狀態
  const [imgLoadStatus, setImgLoadStatus] = useState([
    { type: "backdrop", isLoaded: false },
    { type: "poster", isLoaded: false },
  ]);


  const SIMILAR_URL = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=e86818f56e7d92f357708ecb03052800&page=1`;
  const CURRENT_DETAIL_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;
  const TRAILER_URL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      getData(CURRENT_DETAIL_URL, setCurrentMovie);
      getData(TRAILER_URL, setTrailer);
      getData(SIMILAR_URL, setSimilarMovies);
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
      getData(TRAILER_URL, setTrailer);
    }
    // 更新目前的 watchlist 狀態
    setInWatchlist(watchlist.find((movie) => movie.id === id) !== undefined);
    window.scrollTo(0, 0);
    return () => {
      subscribed = false;
    };
  }, [id]);

  useEffect(() => {
    // 更新目前的 watchlist 狀態
    setInWatchlist(watchlist.find((movie) => movie.id === id) !== undefined);
    // 存至 localStorage
    window.localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  /**
   * * 接收一個 id 作為參數，更新 watchlist 清單內的資料
   * @param {*} id 目前頁面電影的 Id
   */
  function changeWatchlist(id) {
    setWatchlist((prev) => {
      if (inWatchlist) {
        return prev.filter((movie) => movie.id !== id);
      } else {
        return [...prev, { id: id, watched: false }];
      }
    });
  }

  // * 預告片 key
  const trailerKey =
    trailer.results &&
    trailer.results.find(({ type }) => type === "Trailer" || type === "Teaser")
      ? trailer.results.find(
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
    // 如果為 null，則表示 API 為提供該張圖片
    if (currentMovie.poster_path === null) {
      // 手動設定 poster 的載入狀態為 true
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
        <div className="movie-detail__intro">
          <div className="movie-detail__backdrop">
            <img
              src={`https://image.tmdb.org/t/p/original/${currentMovie.backdrop_path}`}
              onError={noBackdrop}
              onLoad={(e) => changeImgStatus(e)}
              alt="backdrop"
            />
          </div>
          <div className="movie-detail__content">
            <div className="container container--lg">
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
                    <i className="fa-solid fa-play"></i>Watch Trailer
                  </button>
                  <button
                    className="movie-detail__btn btn btn--transparent btn--lg"
                    onClick={() => changeWatchlist(id)}>
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
        </div>
        <div className="movie-detail__trailer">
          <div className="container">
            <h2 className="layout-title">Trailer</h2>
            <div
              className={`movie-detail__video-container ${
                trailerKey ? "" : "movie-detail__video-container--no-video"
              }`}>
              {trailerKey ? (
                <iframe
                  className="movie-detail__video"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen></iframe>
              ) : (
                <p className="placeholder-text">No Trailer!</p>
              )}
            </div>
          </div>
        </div>

        <div className="movie-swiper movie-detail__similar">
          <div className="container">
            <h2 className="layout-title">Similar Movies</h2>
            {similarMovies.results && similarMovies.results.length === 0 ? (
              <p class="placeholder-text">No similar movies!</p>
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
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
