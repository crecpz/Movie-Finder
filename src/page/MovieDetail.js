import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData, noBackdrop, noPoster } from "../utils/function";

const MovieDetail = ({ watchlist, setWatchlist }) => {
  const { id } = useParams();
  const [currentMovie, setCurrentMovie] = useState({});
  const [similarMovies, setSimilarMovies] = useState({});
  // 儲存預告片資料
  const [trailer, setTrailer] = useState({});
  // 表示當前頁面的電影是否已經加進 watchlist
  const [inWatchlist, setInWatchlist] = useState(
    watchlist.find((movie) => movie.id === id) !== undefined
  );

  //! 接下來要在結構做出樣式(+到watchlist or 沒+ 的樣式)，
  //! 嚴防重複增加，根據目前是否 isInWatchlist 來決定按下之後是要做移除還是增加
  let similarPageNum = 1;
  const SIMILAR_URL = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=e86818f56e7d92f357708ecb03052800&page=${similarPageNum}`;
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

  // 檢查 currentMovie 物件內是否為空，若為空則代表現在正在 loading
  const isLoading = currentMovie && Object.keys(currentMovie).length === 0;

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="movie-detail">
        <div className="movie-detail__intro">
          <div className="movie-detail__backdrop">
            <img
              src={`https://image.tmdb.org/t/p/original/${
                currentMovie && currentMovie.backdrop_path
              }`}
              onError={noBackdrop}
              alt="movie-detail-backdrop"
            />
          </div>

          <div className="movie-detail__content">
            <div className="container container--lg">

              {isLoading ? (
                <Skeleton
                  width={300}
                  height={450}
                  className="movie-detail__poster"
                />
              ) : (
                <img
                  className="movie-detail__poster"
                  src={`https://image.tmdb.org/t/p/original/${
                    currentMovie ? currentMovie.poster_path : ""
                  }`}
                  onError={noPoster}
                  alt="movie-poster"
                />
              )}

              <div className="movie-detail__texts">
                <h3 className="movie-detail__title">
                  {currentMovie.original_title ? (
                    currentMovie.original_title
                  ) : (
                    <Skeleton />
                  )}
                </h3>
                <div className="movie-detail__genres-tag-wrapper genres-tag-wrapper">
                  {currentMovie && currentMovie.genres
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
                    {currentMovie ? currentMovie.release_date : ""}
                  </p>
                  <p className="vote movie-detail__vote">
                    {currentMovie ? currentMovie.vote_average : ""}
                    <i className="fa-solid fa-star"></i>
                  </p>
                  <p className="movie-detail__runtime">
                    {currentMovie ? currentMovie.runtime : ""} Minutes
                  </p>
                </div>
                <p className="movie-detail__overview">
                  {currentMovie ? currentMovie.overview : ""}
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
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default MovieDetail;
