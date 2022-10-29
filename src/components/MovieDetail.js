import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieDetail = () => {
  const [currentMovie, setCurrentMovie] = useState({});
  const { id } = useParams();

  const API_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`;

  useEffect(() => {
    getMovieData();
  }, []);

  function getMovieData() {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=e86818f56e7d92f357708ecb03052800`
    )
      .then((res) => res.json())
      .then((data) => setCurrentMovie(data));
  }

  return (
    <div className="movie-detail">
      <div className="movie-detail__backdrop">
        <img
          src={`https://image.tmdb.org/t/p/original/${
            currentMovie && currentMovie.backdrop_path
          }`}
          alt="movie-detail-backdrop"
        />
      </div>
      <div className="movie-detail__intro">
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
        </div>
      </div>
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
