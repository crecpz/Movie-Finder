import React, { useState } from "react";
import { Link } from "react-router-dom";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";
import { useRef } from "react";

const MovieCard = ({ movie }) => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // console.log(containerRef.current)
  }, []);
  // console.log(cardRef && cardRef.current.clientWidth)

  // console.log(cardRef.current.clientWidth)

  return isLoading ? (
    <div className="movie-card-link">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Skeleton />
      </SkeletonTheme>
    </div>
  ) : (
    <Link to={`/movie/${movie && movie.id}`} className="movie-card-link" >
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
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
