import converter  from 'chinese_convert';

const MovieCard = ({ id, title, overview, poster_path }) => {
  const API_IMG = "https://image.tmdb.org/t/p/w500/";
  return (
    <div className="movie-card">
      <img className="movie-card__img" src={API_IMG + poster_path} />
      <p className="movie-card__title">{converter.cn2tw(title)}</p>
      <p className="movie-card__overview">{converter.cn2tw(overview)}</p>
    </div>
  );
};

export default MovieCard;