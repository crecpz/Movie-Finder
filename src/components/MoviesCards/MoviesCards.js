import { Link } from "react-router-dom";


const MoviesCards = ({ movie }) => {
  // 確保電影有圖片跟標題，若不存在的就不顯示在此
  return movie.poster_path && (movie.title || movie.original_title) ? (
    <Link to={`/movie/${movie.id}`} className="movies-card-link card">
        <div className="movies-card">
          <img
            className="movies-card__img"
            src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
            alt="movie-card-img"
          />
          <div className="movies-card__text">
            <h3 className="movies-card__title">{movie.title}</h3>
            <div className="movies-card__info">
              {movie.release_date ? <p>{movie.release_date}</p> : ""}
              {movie.vote_average ? (
                <p>
                  <i className="fa-solid fa-star"></i>
                  {movie.vote_average}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
    </Link>
  ) : (
    ""
  );
};

export default MoviesCards;
