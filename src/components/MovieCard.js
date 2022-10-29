import React from "react";
import { Link } from "react-router-dom";
import MovieDetail from "./MovieDetail";

const MovieCard = ({ movie }) => {

  return (
    <Link to={`/movie/${movie && movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <img
          className="movie-card__img"
          src={`https://image.tmdb.org/t/p/w300/${movie && movie.poster_path}`}
          alt="move-card-img"
        />
        <div className="movie-card__text">
          <h3 className="movie-card__title">{movie && movie.original_title}</h3>
          <div className="movie-card__info">
            <p className="movie-card__release-date">
              {movie && movie.release_date}
            </p>
            <p className="movie-card__vote">
              {movie && movie.vote_average}
              <i className="fa-solid fa-star"></i>
            </p>
          </div>
          {/* <p className="movie-card__overview">{movie && movie.overview}</p> */}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
