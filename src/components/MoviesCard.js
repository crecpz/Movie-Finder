import { Link } from "react-router-dom";

const MoviesCard = ({ movie }) => {
  // 不存在圖片的就不顯示在此
  return movie.poster_path ? (
    <Link
      to={`/movie/${movie ? movie.id : ""}`}
      className="movies-card-link card">
      <div className="movies-card">
        <img
          className="movies-card__img"
          src={`https://image.tmdb.org/t/p/w300/${movie && movie.poster_path}`}
          alt="movie-card-img"
        />

        <div className="movies-card__text">
          <h3 className="movies-card__title">
            {movie ? movie.original_title : ""}
          </h3>
          <div className="movies-card__info">
            <p className="movies-card__release-date">
              {movie ? movie.release_date : ""}
            </p>
            <p className="movies-card__vote">
              {movie ? movie.vote_average : ""}
              <i className="fa-solid fa-star"></i>
            </p>
          </div>
        </div>
      </div>
    </Link>
  ) : (
    ""
  );
};

export default MoviesCard;
