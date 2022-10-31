import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getData } from "../functions/function";

const MovieDetail = () => {
  const { id } = useParams();
  const [currentMovie, setCurrentMovie] = useState({});
  const [similarMovies, setSimilarMovies] = useState({});
  const [trailer, setTrailer] = useState({});

  const CURRENT_DETAIL_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;
  const TRAILER_URL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=e86818f56e7d92f357708ecb03052800`;
  const SIMILAR_URL = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=e86818f56e7d92f357708ecb03052800&page=1`;

  useEffect(() => {
    getData(CURRENT_DETAIL_URL, setCurrentMovie);
    getData(SIMILAR_URL, setSimilarMovies);
    getData(TRAILER_URL, setTrailer);
  }, []);

  useEffect(() => {
    getData(CURRENT_DETAIL_URL, setCurrentMovie);
    getData(SIMILAR_URL, setSimilarMovies);
    getData(TRAILER_URL, setTrailer);
    window.scrollTo(0, 0);
  }, [id]);

  const trailerKey =
    trailer.results &&
    trailer.results.find(({ type }) => type === "Trailer" || type === "Teaser")
      ? trailer.results.find(
          ({ type }) => type === "Trailer" || type === "Teaser"
        ).key
      : "";

  const similarMovieElements =
    similarMovies.results &&
    similarMovies.results.map((movie) => {
      return (
        <SwiperSlide>
          <div className="sm-swiper">
            <Link
              to={`/movie/${movie && movie.id}`}
              className="sm-swiper__img-link">
              <img
                src={`https://image.tmdb.org/t/p/original/${
                  movie && movie.backdrop_path
                }`}
                className="sm-swiper__backdrop"
                alt="movie-backdrop"
              />
            </Link>
            <Link
              to={`/movie/${movie && movie.id}`}
              className="sm-swiper__title-link">
              <h3 className="sm-swiper__name">
                {movie && movie.original_title}
              </h3>
            </Link>
          </div>
        </SwiperSlide>
      );
    });

  // fetch(CURRENT_DETAIL_URL)
  // .then((res) => res.json())
  // .then((data) => console.log(data));

  return (
    <div className="movie-detail">
      <div className="movie-detail__intro">
        <div className="movie-detail__backdrop">
          <img
            src={`https://image.tmdb.org/t/p/original/${
              currentMovie && currentMovie.backdrop_path
            }`}
            alt="movie-detail-backdrop"
          />
        </div>
        <div className="movie-detail__content">
          <div className="container">
            <img
              className="movie-detail__poster"
              src={`https://image.tmdb.org/t/p/original/${
                currentMovie ? currentMovie.poster_path : ""
              }`}
              alt="movie-poster"
            />
            <div className="movie-detail__texts">
              <h2 className="movie-detail__title">
                {currentMovie ? currentMovie.original_title : ""}
              </h2>
              <div className="movie-detail__genres-wrapper">
                {currentMovie && currentMovie.genres
                  ? currentMovie.genres.map((genres) => {
                      return (
                        <div className="movie-detail__genres">
                          {genres.name}
                        </div>
                      );
                    })
                  : ""}
              </div>
              <div className="movie-detail__info">
                <p className="movie-detail__release-date">
                  {currentMovie ? currentMovie.release_date : ""}
                </p>
                <p className="movie-detail__vote">
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
                <button className="movie-detail__btn btn btn--transparent btn--lg">
                  <i className="fa-solid fa-plus"></i>Add Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="movie-detail__trailer">
        <div className="container">
          <h3 className="layout-title">Trailer</h3>
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
          <h3 className="layout-title">Similar Movies</h3>
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
                spaceBetween: 0,
              },
              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1300: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1400: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}>
            {similarMovieElements}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
