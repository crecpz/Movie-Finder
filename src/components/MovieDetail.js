import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const MovieDetail = () => {
  const [currentMovie, setCurrentMovie] = useState({});
  const [similarMovies, setSimilarMovies] = useState({});
  const { id } = useParams();

  const CURRENT_DETAIL_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;
  // const
  const TRAILER_URL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=e86818f56e7d92f357708ecb03052800`;
  const SIMILAR_URL = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=e86818f56e7d92f357708ecb03052800&page=1`;
  const youtubeLink = "http://youtube.com/watch?v=";

  useEffect(() => {
    getData(CURRENT_DETAIL_URL, setCurrentMovie);
    getData(SIMILAR_URL, setSimilarMovies);
  }, []);

  useEffect(() => {
    getData(CURRENT_DETAIL_URL, setCurrentMovie);
    getData(SIMILAR_URL, setSimilarMovies);
    window.scrollTo(0, 0);
  }, [id]);

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

  function getData(url, setState) {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setState(data));
  }

  const [isPopup, setIsPopup] = useState(false);
  const [trailer, setTrailer] = useState({});
  function popup() {
    setIsPopup((prev) => !prev);
    getData(TRAILER_URL, setTrailer);
  }

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
          <img
            className="movie-detail__poster"
            src={`https://image.tmdb.org/t/p/original/${
              currentMovie && currentMovie.poster_path
            }`}
            alt="movie-poster"
          />
          <div className="movie-detail__texts">
            <h2 className="movie-detail__title">
              {currentMovie && currentMovie.original_title}
            </h2>
            <div className="movie-detail__info">
              <p className="movie-detail__release-date">
                {currentMovie && currentMovie.release_date}
              </p>
              <p className="movie-detail__vote">
                {currentMovie && currentMovie.vote_average}
                <i className="fa-solid fa-star"></i>
              </p>
            </div>
            <p className="movie-detail__overview">
              {currentMovie && currentMovie.overview}
            </p>
            <span className="movie-detail__genres"></span>
            <div className="movie-detail__trailer"></div>
            <div className="movie-detail__btns">
              <button
                className="movie-detail__btn btn btn--red btn--lg"
                onClick={popup}>
                <i className="fa-solid fa-play"></i>Watch Trailer
              </button>
              <button className="movie-detail__btn btn btn--black btn--lg">
                <i className="fa-solid fa-plus"></i>Add Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="movie-detail__trailer"></div>
      <div className="movie-swiper movie-detail__similar">
        <div className="container">
          <h3 className="movie-swiper__title">Similar Movies</h3>
          <Swiper
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
            className="movie-swiper">
            {similarMovieElements}
          </Swiper>
        </div>
      </div>

      {/* 測試用的 modal */}
      {/* <div className={`t ${isPopup ? "t--open" : ""}`}>
        <button onClick={() => setIsPopup(false)}>x</button>
        <iframe
          // width="560"
          // height="315"
          className="movie-detail__iframe"
          src={`https://www.youtube.com/embed/${
            trailer.results &&
            trailer.results.find((result) => result.type === "Trailer").key
          }`}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div> */}
    </div>
  );
};

export default MovieDetail;

/**



<div className="carousel__img">
  <img
    src={`https://image.tmdb.org/t/p/original/${
      movie && movie.backdrop_path
    }`}
    className="carousel__backdrop"
    alt="movie-backdrop"
  />
  <img
    src={`https://image.tmdb.org/t/p/original/${
      movie && movie.poster_path
    }`}
    className="carousel__poster"
    alt="movie-poster"
  />
</div>
<div className="carousel__text">
  <h2 className="carousel__title">{movie && movie.original_title}</h2>
  <div className="carousel__info">
    <p className="carousel__release-date">
      {movie && movie.release_date}
    </p>
    <p className="carousel__vote">
      {movie && movie.vote_average}
      <i className="fa-solid fa-star"></i>
    </p>
  </div>
  <p className="carousel__overview">{movie && movie.overview}</p>
</div>




 */
